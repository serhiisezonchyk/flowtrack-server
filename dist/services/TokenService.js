"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../utils/constants");
class TokenService {
    static async generateAccessToken(payload) {
        const age = constants_1.ACCESS_TOKEN_EXPIRATION;
        return await jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: `${age}` });
    }
    static async generateRefreshToken(payload) {
        const age = constants_1.COOKIE_SETTINGS.REFRESH_TOKEN.maxAge;
        return await jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: `${age}` });
    }
    static async verifyAccessToken(accessToken) {
        return (await jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN));
    }
    static async verifyRefreshToken(refreshToken) {
        return await jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN);
    }
    static isExpired(exp) {
        return Date.now() > exp * 1000;
    }
}
exports.default = TokenService;
