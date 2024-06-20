import { Request, Response, Router } from 'express';
import authRouter from './auth.router';
import { checkAccess } from '../middleware/checkAccess';
import boardRouter from './board.router';
import sectionRouter from './section.router';
import taskRouter from './task.router';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/board', checkAccess, boardRouter);
router.use('/section', checkAccess, sectionRouter);
router.use('/task', checkAccess, taskRouter);

export default router;
