"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const section_controller_1 = __importDefault(require("../controllers/section.controller"));
const validateData_1 = require("../middleware/validateData");
const sectionSchemas_1 = require("../schemas/sectionSchemas");
class SectionRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get('/:boardId', section_controller_1.default.getAll);
        this.router.post('/:boardId', section_controller_1.default.create);
        this.router.patch('/:sectionId', (0, validateData_1.validateData)(sectionSchemas_1.sectionUpdateSchema), section_controller_1.default.updateTitle);
        this.router.put('/update-section-position/:boardId', section_controller_1.default.updatePositions);
        this.router.put('/update-task-position/:boardId', section_controller_1.default.updateTasksPositions);
        this.router.delete('/:sectionId', section_controller_1.default.delete);
    }
}
exports.default = new SectionRouter().router;
