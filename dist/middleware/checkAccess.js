"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccess = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAccess = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ').at(1);
    if (!accessToken)
        return res.status(401).json({ error: 'Not authenticated', details: '' });
    jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN, async (error, decoded) => {
        if (error)
            return res.status(403).json({ error: 'Not authenticated', details: error });
        const decodedValue = decoded;
        req.user = decodedValue;
        next();
    });
};
exports.checkAccess = checkAccess;
