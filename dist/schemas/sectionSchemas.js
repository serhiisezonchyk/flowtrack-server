"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionUpdateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sectionUpdateSchema = zod_1.default.object({
    title: zod_1.default
        .string()
        .trim()
        .min(4, { message: 'Title is required and cannot be empty or whitespace. Minimum length - 4s.' }),
});
