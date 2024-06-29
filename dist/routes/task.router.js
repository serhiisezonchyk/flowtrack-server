"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_conroller_1 = __importDefault(require("../controllers/task.conroller"));
const validateData_1 = require("../middleware/validateData");
const taskSchemas_1 = require("../schemas/taskSchemas");
class TaksRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get('/:taskId', task_conroller_1.default.getOne);
        // this.router.get('/:boardId', TaksController.getAll);
        this.router.get('/:boardId/:sectionId', task_conroller_1.default.getAllForSection);
        this.router.post('/:sectionId', task_conroller_1.default.create);
        this.router.delete('/:taskId', task_conroller_1.default.delete);
        this.router.put('/:taskId', (0, validateData_1.validateData)(taskSchemas_1.taskUpdateSchema), task_conroller_1.default.update);
    }
}
exports.default = new TaksRouter().router;
