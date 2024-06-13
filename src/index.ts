import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { routeNotFound } from './middleware/routeNotFound';
dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Log not found routes
app.use(routeNotFound);

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
