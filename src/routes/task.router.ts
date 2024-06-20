import { Router } from 'express';
import TaksController from '../controllers/task.conroller';

class TaksRouter {
  router = Router();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.get('/:boardId', TaksController.getAll);
    this.router.get('/:boardId/:sectionId', TaksController.getAllForSection);
    this.router.post('/:sectionId', TaksController.create);
    this.router.delete('/:taskId', TaksController.delete);
    this.router.put('/:taskId', TaksController.update);
  }
}
export default new TaksRouter().router;
