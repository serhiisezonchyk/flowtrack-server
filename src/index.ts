import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { routeNotFound } from './middleware/routeNotFound';
import router from './routes';
import scheduler from 'node-schedule';
import tokenCleanUp from './utils/tokenCleanup';
import path from 'path';

dotenv.config();

const app: Express = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

//Log not found routes
if (process.env.NODE_ENV === 'development') app.use(routeNotFound);

//BUILD
if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.join(__dirname, '/front_build')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'front_build', 'index.html'));
  });
}

scheduler.scheduleJob('0 0 * * *', tokenCleanUp);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
