import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { JwtType } from '../services/TokenService';
import { COOKIE_SETTINGS } from '../utils/constants';
declare global {
  namespace Express {
    interface Request {
      user?: JwtType;
    }
  }
}
export const checkAccess = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(' ').at(1);

  if (!accessToken)
    return res
      .status(401)
      .json({ error: 'Not authenticated', details: '' });
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN as string,
    async (error: VerifyErrors | any, decoded: JwtType | any) => {
      if (error) return res.status(403).json({ error: 'Not authenticated', details: error });
      const decodedValue: JwtType = decoded;
      req.user = decodedValue;
      next();
    },
  );
};
