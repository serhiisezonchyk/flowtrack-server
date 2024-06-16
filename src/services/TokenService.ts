import { Refresh } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRATION, COOKIE_SETTINGS } from '../utils/constants';

export interface JwtType {
  id: string;
  login: string;
}
export interface CustomJwtPayload extends JwtPayload {
  id: string;
  login: string;
}
class TokenService {
  static async generateAccessToken(payload: JwtType) {
    const age = ACCESS_TOKEN_EXPIRATION;
    return await jwt.sign(payload, process.env.ACCESS_TOKEN as string, { expiresIn: `${age}` });
  }
  static async generateRefreshToken(payload: JwtType) {
    const age = COOKIE_SETTINGS.REFRESH_TOKEN.maxAge;
    return await jwt.sign(payload, process.env.REFRESH_TOKEN as string, { expiresIn: `${age}` });
  }
  static async verifyAccessToken(accessToken: string): Promise<CustomJwtPayload> {
    return (await jwt.verify(accessToken, process.env.ACCESS_TOKEN as string)) as CustomJwtPayload;
  }
  static async verifyRefreshToken(refreshToken: string): Promise<CustomJwtPayload> {
    return await (jwt.verify(refreshToken, process.env.REFRESH_TOKEN as string) as CustomJwtPayload);
  }
  static isExpired(exp: number): boolean {
    return Date.now() > exp * 1000;
  }
}
export default TokenService;
