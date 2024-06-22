import { Router } from 'express';
import BoardController from '../controllers/board.controller';
import { validateData } from '../middleware/validateData';
import { boardCreateSchema, boardUpdateSchema } from '../schemas/boardSchemas';

class BoardRouter {
  router = Router();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.get('/', BoardController.getAll);
    this.router.get('/:slug', BoardController.getOne);
    this.router.delete('/:id', BoardController.delete);
    this.router.post('/', validateData(boardCreateSchema), BoardController.create);
    this.router.put('/:id', validateData(boardUpdateSchema), BoardController.update);
    this.router.patch('/:id', BoardController.changeIsSaved);
  }
}
export default new BoardRouter().router;
