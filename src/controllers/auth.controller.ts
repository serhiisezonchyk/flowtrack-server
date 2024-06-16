import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import TokenService, { JwtType } from '../services/TokenService';
import { ACCESS_TOKEN_EXPIRATION, COOKIE_SETTINGS } from '../utils/constants';
import RefreshController from './refresh.controller';
import { JwtPayload } from 'jsonwebtoken';

export default class AuthController {
  async signUp(req: Request, res: Response) {
    const { login, password, checkPassword } = req.body;
    try {
      if (password !== checkPassword)
        res.status(401).json({ error: 'Invalid data', details: 'Passwords are different' });
      const isExist = await prisma.user.findUnique({
        where: {
          login: login,
        },
      });
      if (isExist) return res.status(401).json({ error: 'Invalid data', details: 'Invalid data. Try later.' });
      const hashedPass = bcrypt.hashSync(password, 8);

      const createdUser = await prisma.user.create({
        data: {
          login: login,
          password: hashedPass,
        },
      });
      if (!createdUser) res.status(401).json({ error: 'Something occured while user creation', details: 'Try later.' });
      res.status(201).json({ message: 'Success' });
    } catch (error) {
      res.status(501).json({ error: 'SignUp was failed', details: error });
    }
  }
  async signIn(req: Request, res: Response) {
    const { login, password } = req.body;
    try {
      const isExist = await prisma.user.findUnique({
        where: {
          login: login,
        },
      });
      if (!isExist) return res.status(401).json({ error: 'Invalid credentials', details: 'Username or pasword' });
      const isPasswordValid = bcrypt.compareSync(password, isExist.password);
      if (!isPasswordValid)
        return res.status(401).json({ error: 'Invalid credentials', details: 'Username or pasword' });

      const payload: JwtType = { id: isExist.id, login: isExist.login };
      const accessToken = await TokenService.generateAccessToken(payload);
      const refreshToken = await TokenService.generateRefreshToken(payload);

      try {
        await RefreshController.createRefreshSession({ id: isExist.id, refreshToken});
        const { password: removedPass, ...data } = isExist;
        return res
          .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
          .status(201)
          .json({ accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION, data });
      } catch (error) {
        return res.status(501).json({ error: 'Logout failed', details: error });
      }
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'SignUp was failed', details: error });
    }
  }
  async logout(req: Request, res: Response) {
    const data = req.cookies;
    const refreshToken = data?.refreshToken;
    if (!refreshToken) {
      return res.clearCookie('refreshToken').status(200).json({ message: 'Success' });
    }
    try {
      await RefreshController.deleteRefreshSession(refreshToken);
      return res.clearCookie('refreshToken').status(200).json({ message: 'Success' });
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Logout was failed', details: error });
    }
  }
  async refresh(req: Request, res: Response) {
    const cookies = req.cookies;
    const currentRefreshToken = cookies.refreshToken;
    if (!currentRefreshToken)
      return res.status(401).json({ error: 'Refresh Token is required!', details: 'Token not found exception.' });
    try {
      const refreshSession = await RefreshController.getRefreshSession(currentRefreshToken);
      if (!refreshSession)
        return res.status(401).json({ error: 'Invalid refresh token', details: 'Token not found in db.' });
      let payload: JwtPayload | string;
      try {
        await RefreshController.deleteRefreshSession(currentRefreshToken);
        try {
          payload = await TokenService.verifyRefreshToken(currentRefreshToken);
        } catch (error) {
          return res
            .status(403)
            .json({ error: 'Refresh token was expired.', details: 'Please make a new sign in request' });
        }

        const user = await prisma.user.findUnique({
          where: {
            id: payload.id,
          },
        });
        if (user) {
          const actualPayload: JwtType = { id: user?.id, login: user.login };
          const accessToken = await TokenService.generateAccessToken(actualPayload);
          const refreshToken = await TokenService.generateRefreshToken(actualPayload);
          await RefreshController.createRefreshSession({
            id: actualPayload.id,
            refreshToken: refreshToken,
          });
          const { password, ...data } = user;
          return res
            .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
            .status(201)
            .json({ accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION, data });
        }
        res.status(403).json({ error: 'Something went wrong', details: 'Please please try again later.' });
      } catch (error) {
        res.status(403).json({ error: 'Cannot verify token', details: 'Token expired' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Refresh  failed', details: error });
    }
  }
}
