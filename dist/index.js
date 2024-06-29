"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routeNotFound_1 = require("./middleware/routeNotFound");
const routes_1 = __importDefault(require("./routes"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const tokenCleanup_1 = __importDefault(require("./utils/tokenCleanup"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api', routes_1.default);
//Log not found routes
if (process.env.NODE_ENV === 'development')
    app.use(routeNotFound_1.routeNotFound);
//BUILD
if (process.env.NODE_ENV !== 'development') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '/front_build')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'front_build', 'index.html'));
    });
}
node_schedule_1.default.scheduleJob('0 0 * * *', tokenCleanup_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
