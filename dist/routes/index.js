"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const checkAccess_1 = require("../middleware/checkAccess");
const board_router_1 = __importDefault(require("./board.router"));
const section_router_1 = __importDefault(require("./section.router"));
const task_router_1 = __importDefault(require("./task.router"));
const router = (0, express_1.Router)();
router.use('/auth', auth_router_1.default);
router.use('/board', checkAccess_1.checkAccess, board_router_1.default);
router.use('/section', checkAccess_1.checkAccess, section_router_1.default);
router.use('/task', checkAccess_1.checkAccess, task_router_1.default);
exports.default = router;
