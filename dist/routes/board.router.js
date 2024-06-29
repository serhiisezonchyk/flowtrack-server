"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const board_controller_1 = __importDefault(require("../controllers/board.controller"));
const validateData_1 = require("../middleware/validateData");
const boardSchemas_1 = require("../schemas/boardSchemas");
class BoardRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get('/', board_controller_1.default.getAll);
        this.router.get('/:slug', board_controller_1.default.getOne);
        this.router.delete('/:id', board_controller_1.default.delete);
        this.router.post('/', (0, validateData_1.validateData)(boardSchemas_1.boardCreateSchema), board_controller_1.default.create);
        this.router.put('/:id', (0, validateData_1.validateData)(boardSchemas_1.boardUpdateSchema), board_controller_1.default.update);
        this.router.patch('/:id', board_controller_1.default.changeIsSaved);
    }
}
exports.default = new BoardRouter().router;
