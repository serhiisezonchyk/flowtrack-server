"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUpSchema = zod_1.default.object({
    login: zod_1.default.string().email({ message: 'Invalid email address' }),
    password: zod_1.default
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(100, { message: 'Password must be less than 100 characters long' })
        .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
    })
        .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
    })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' })
        .regex(/[^a-zA-Z0-9]/, {
        message: 'Password must contain at least one special character',
    }),
    checkPassword: zod_1.default.string(),
});
//TODO : REFINE PASSWORDS
