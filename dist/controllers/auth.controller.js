"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../db"));
const TokenService_1 = __importDefault(require("../services/TokenService"));
const constants_1 = require("../utils/constants");
const refresh_controller_1 = __importDefault(require("./refresh.controller"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client();
class AuthController {
    static async signUp(req, res) {
        const { login, password, checkPassword } = req.body;
        try {
            if (password !== checkPassword)
                res.status(401).json({ error: 'Invalid data', details: 'Passwords are different' });
            const isExist = await db_1.default.user.findUnique({
                where: {
                    login: login,
                },
            });
            if (isExist)
                return res.status(401).json({ error: 'Invalid data', details: 'Invalid data. Try later.' });
            const hashedPass = bcryptjs_1.default.hashSync(password, 8);
            const createdUser = await db_1.default.user.create({
                data: {
                    login: login,
                    password: hashedPass,
                },
            });
            if (!createdUser)
                res.status(401).json({ error: 'Something occured while user creation', details: 'Try later.' });
            res.status(201).json({ message: 'Success' });
        }
        catch (error) {
            res.status(501).json({ error: 'SignUp was failed', details: error });
        }
    }
    static async signIn(req, res) {
        const { login, password } = req.body;
        try {
            const isExist = await db_1.default.user.findUnique({
                where: {
                    login: login,
                },
            });
            if (!isExist)
                return res.status(401).json({ error: 'Invalid credentials', details: 'Username or pasword' });
            const isPasswordValid = bcryptjs_1.default.compareSync(password, isExist.password);
            if (!isPasswordValid)
                return res.status(401).json({ error: 'Invalid credentials', details: 'Username or pasword' });
            const payload = { id: isExist.id, login: isExist.login };
            const accessToken = await TokenService_1.default.generateAccessToken(payload);
            const refreshToken = await TokenService_1.default.generateRefreshToken(payload);
            try {
                await refresh_controller_1.default.createRefreshSession({ id: isExist.id, refreshToken });
                const { password: removedPass, ...data } = isExist;
                return res
                    .cookie('refreshToken', refreshToken, constants_1.COOKIE_SETTINGS.REFRESH_TOKEN)
                    .status(201)
                    .json({ accessToken, accessTokenExpiration: constants_1.ACCESS_TOKEN_EXPIRATION, data });
            }
            catch (error) {
                return res.status(501).json({ error: 'Logout failed', details: error });
            }
        }
        catch (error) {
            return res.status(501).json({ error: 'SignUp was failed', details: error });
        }
    }
    static async logout(req, res) {
        const data = req.cookies;
        const refreshToken = data?.refreshToken;
        if (!refreshToken) {
            return res.clearCookie('refreshToken').status(200).json({ message: 'Success' });
        }
        try {
            await refresh_controller_1.default.deleteRefreshSession(refreshToken);
            return res.clearCookie('refreshToken').status(200).json({ message: 'Success' });
        }
        catch (error) {
            return res.status(501).json({ error: 'Logout was failed', details: error });
        }
    }
    static async refresh(req, res) {
        const cookies = req.cookies;
        const currentRefreshToken = cookies.refreshToken;
        if (!currentRefreshToken)
            return res.status(401).json({ error: 'Refresh Token is required!', details: 'Token not found exception.' });
        try {
            const refreshSession = await refresh_controller_1.default.getRefreshSession(currentRefreshToken);
            if (!refreshSession)
                return res.status(401).json({ error: 'Invalid refresh token', details: 'Token not found in db.' });
            let payload;
            try {
                await refresh_controller_1.default.deleteRefreshSession(currentRefreshToken);
                try {
                    payload = await TokenService_1.default.verifyRefreshToken(currentRefreshToken);
                }
                catch (error) {
                    return res
                        .status(403)
                        .json({ error: 'Refresh token was expired.', details: 'Please make a new sign in request' });
                }
                const user = await db_1.default.user.findUnique({
                    where: {
                        id: payload.id,
                    },
                });
                if (user) {
                    const actualPayload = { id: user?.id, login: user.login };
                    const accessToken = await TokenService_1.default.generateAccessToken(actualPayload);
                    const refreshToken = await TokenService_1.default.generateRefreshToken(actualPayload);
                    await refresh_controller_1.default.createRefreshSession({
                        id: actualPayload.id,
                        refreshToken: refreshToken,
                    });
                    const { password, ...data } = user;
                    return res
                        .cookie('refreshToken', refreshToken, constants_1.COOKIE_SETTINGS.REFRESH_TOKEN)
                        .status(201)
                        .json({ accessToken, accessTokenExpiration: constants_1.ACCESS_TOKEN_EXPIRATION, data });
                }
                res.status(403).json({ error: 'Something went wrong', details: 'Please please try again later.' });
            }
            catch (error) {
                res.status(403).json({ error: 'Cannot verify token', details: 'Token expired' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Refresh  failed', details: error });
        }
    }
    static async googleSignIn(req, res) {
        const { credential } = req.body;
        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            });
            const payload = ticket.getPayload();
            const userid = payload?.sub;
            const userEmail = payload?.email;
            if (!userEmail || !userid) {
                return res.status(401).json({ error: 'Cannot create user by this Google account', details: {} });
            }
            // Use upsert to create or update the user
            const user = await db_1.default.user.upsert({
                where: {
                    login: userEmail,
                },
                update: {
                    googleId: userid,
                },
                create: {
                    login: userEmail,
                    googleId: userid,
                    password: '',
                },
            });
            const jwtPayload = { id: user.id, login: user.login };
            const accessToken = await TokenService_1.default.generateAccessToken(jwtPayload);
            const refreshToken = await TokenService_1.default.generateRefreshToken(jwtPayload);
            await refresh_controller_1.default.createRefreshSession({
                id: user.id,
                refreshToken,
            });
            res
                .cookie('refreshToken', refreshToken, constants_1.COOKIE_SETTINGS.REFRESH_TOKEN)
                .status(201)
                .json({ accessToken, accessTokenExpiration: constants_1.ACCESS_TOKEN_EXPIRATION, data: user });
        }
        catch (error) {
            res.status(401).json({ error: 'Invalid token', details: error });
        }
    }
}
exports.default = AuthController;
