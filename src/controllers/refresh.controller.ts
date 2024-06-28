import prisma from '../db';
import { COOKIE_SETTINGS } from '../utils/constants';

export default class RefreshController {
  static async getRefreshSession(refreshToken: string) {
    const refreshSession = await prisma.refresh.findUnique({
      where: {
        token: refreshToken,
      },
    });
    return refreshSession;
  }
  static async createRefreshSession({ id, refreshToken }: { id: string; refreshToken: string }) {
    try {
      const expiresAt = Math.floor(Date.now() / 1000) + COOKIE_SETTINGS.REFRESH_TOKEN.maxAge / 1000;
      const data = await prisma.refresh.create({
        data: {
          user: { connect: { id: id } },
          token: refreshToken,
          expiresAt,
        },
      });
      return data;
    } catch (error) {
      return null;
    }
  }
  static async deleteRefreshSession(refreshToken: string) {
    await prisma.refresh.delete({
      where: {
        token: refreshToken,
      },
    });
  }
  static async deleteExpiresTokens(now: number) {
    const result = await prisma.refresh.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });
    return result;
  }
}
