"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = void 0;
const zod_1 = require("zod");
function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const validationDetails = error.errors.map((issue) => ({
                    path: issue.path.at(0),
                    message: issue.message,
                }));
                res.status(401).json({ error: 'Validation error', details: validationDetails });
            }
            else {
                res.status(501).json({ message: 'Internal server error' });
            }
        }
    };
}
exports.validateData = validateData;
