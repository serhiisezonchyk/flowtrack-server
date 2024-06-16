import RefreshController from '../controllers/refresh.controller';
import prisma from '../db';
import TokenService from '../services/TokenService';
const tokenCleanUp = async () => {
  const now = Math.floor(Date.now() / 1000);
  try {
    const result = await RefreshController.deleteExpiresTokens(now);
    console.log(`Expired refresh tokens cleaned up: ${result.count} tokens deleted.`);
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
};

export default tokenCleanUp;
