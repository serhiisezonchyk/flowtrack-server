import { Request, Response, Router } from 'express';
import authRouter from './auth.router';
import { checkAccess } from '../middleware/checkAccess';

const router: Router = Router();

router.get('/test', checkAccess, (req: Request, res: Response) => {
  res.status(200).json({ data: 'test' });
});
router.use('/auth', authRouter);

export default router;
