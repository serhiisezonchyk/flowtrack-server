"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const validateData_1 = require("../middleware/validateData");
const userSchemas_1 = require("../schemas/userSchemas");
class AuthRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post('/sign-up', (0, validateData_1.validateData)(userSchemas_1.signUpSchema), auth_controller_1.default.signUp);
        this.router.post('/sign-in', auth_controller_1.default.signIn);
        this.router.post('/logout', auth_controller_1.default.logout);
        this.router.post('/refresh', auth_controller_1.default.refresh);
        this.router.post('/google-sign-in', auth_controller_1.default.googleSignIn);
    }
}
exports.default = new AuthRoutes().router;
