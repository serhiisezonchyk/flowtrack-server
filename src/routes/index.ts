import { Request, Response, Router } from 'express';
import authRouter from './auth.router';
import { checkAccess } from '../middleware/checkAccess';
import boardRouter from './board.router';
import sectionRouter from './section.router';

const router: Router = Router();

router.get('/test', checkAccess, (req: Request, res: Response) => {
  res.status(200).json({ data: 'test' });
});
router.use('/auth', authRouter);
router.use('/board', checkAccess, boardRouter);
router.use('/section', checkAccess, sectionRouter);

export default router;
