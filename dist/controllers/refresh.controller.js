"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const constants_1 = require("../utils/constants");
class RefreshController {
    static async getRefreshSession(refreshToken) {
        const refreshSession = await db_1.default.refresh.findUnique({
            where: {
                token: refreshToken,
            },
        });
        return refreshSession;
    }
    static async createRefreshSession({ id, refreshToken }) {
        try {
            const expiresAt = Math.floor(Date.now() / 1000) + constants_1.COOKIE_SETTINGS.REFRESH_TOKEN.maxAge / 1000;
            const data = await db_1.default.refresh.create({
                data: {
                    user: { connect: { id: id } },
                    token: refreshToken,
                    expiresAt,
                },
            });
            return data;
        }
        catch (error) {
            return null;
        }
    }
    static async deleteRefreshSession(refreshToken) {
        await db_1.default.refresh.delete({
            where: {
                token: refreshToken,
            },
        });
    }
    static async deleteExpiresTokens(now) {
        const result = await db_1.default.refresh.deleteMany({
            where: {
                expiresAt: { lt: now },
            },
        });
        return result;
    }
}
exports.default = RefreshController;
