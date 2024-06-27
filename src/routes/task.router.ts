import { Router } from 'express';
import TaksController from '../controllers/task.conroller';
import { validateData } from '../middleware/validateData';
import { taskUpdateSchema } from '../schemas/taskSchemas';

class TaksRouter {
  router = Router();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.get('/:taskId', TaksController.getOne);
    // this.router.get('/:boardId', TaksController.getAll);
    this.router.get('/:boardId/:sectionId', TaksController.getAllForSection);
    this.router.post('/:sectionId', TaksController.create);
    this.router.delete('/:taskId', TaksController.delete);
    this.router.put('/:taskId', validateData(taskUpdateSchema), TaksController.update);
  }
}
export default new TaksRouter().router;
