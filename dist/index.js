"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const routeNotFound_1 = require("./middleware/routeNotFound");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//Log not found routes
app.use(routeNotFound_1.routeNotFound);
//BUILD
// const __dirname = path.resolve();
// if(process.env.NODE_ENV !=='development'){
//   app.use(express.static(path.join(__dirname,'/frontend/dist')));
//   app.get('*',(req:Request,res:Response)=>{
//     res.sendFile(path.join(__dirname,"frontend","fist","index.html"))
//   })
// }
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map