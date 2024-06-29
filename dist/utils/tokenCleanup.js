"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const refresh_controller_1 = __importDefault(require("../controllers/refresh.controller"));
const tokenCleanUp = async () => {
    const now = Math.floor(Date.now() / 1000);
    try {
        const result = await refresh_controller_1.default.deleteExpiresTokens(now);
        console.log(`Expired refresh tokens cleaned up: ${result.count} tokens deleted.`);
    }
    catch (error) {
        console.error('Error cleaning up expired tokens:', error);
    }
};
exports.default = tokenCleanUp;
