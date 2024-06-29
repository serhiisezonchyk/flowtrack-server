"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskUpdateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.taskUpdateSchema = zod_1.default.object({
    title: zod_1.default.string().min(4, { message: 'Task title should be more than 4 s.' }).optional(),
    content: zod_1.default.string().optional(),
    deadline: zod_1.default.date().optional().nullable(),
});
