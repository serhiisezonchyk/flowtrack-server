"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardUpdateSchema = exports.boardCreateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// description String    @default("Add description here\n🟢 You can add multiline description\n🟢 Let's start...")
// isSaved     Boolean   @default(false)
// slug        String
// icon        String    @default("📃")
// userId      String
exports.boardCreateSchema = zod_1.default.object({
    title: zod_1.default
        .string()
        .trim()
        .min(4, { message: 'Title is required and cannot be empty or whitespace. Minimum length - 4s.' }),
    description: zod_1.default.string().optional(),
    isSaved: zod_1.default.boolean().optional(),
    slug: zod_1.default.string().optional(),
    icon: zod_1.default.string().optional(),
});
exports.boardUpdateSchema = zod_1.default.object({
    title: zod_1.default
        .string()
        .trim()
        .min(4, { message: 'Title is required and cannot be empty or whitespace. Minimum length - 4s.' })
        .optional(),
    description: zod_1.default.string().optional(),
    isSaved: zod_1.default.boolean().optional(),
    icon: zod_1.default.string().optional(),
});
