import { Router } from 'express';
import SectionController from '../controllers/section.controller';
import { validateData } from '../middleware/validateData';
import { sectionUpdateSchema } from '../schemas/sectionSchemas';

class SectionRouter {
  router = Router();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.get('/:boardId', SectionController.getAll);
    this.router.post('/:boardId', SectionController.create);
    this.router.patch('/:sectionId', validateData(sectionUpdateSchema), SectionController.updateTitle);
    this.router.put('/update-section-position/:boardId', SectionController.updatePositions);
    this.router.put('/update-task-position/:boardId', SectionController.updateTasksPositions);
    this.router.delete('/:sectionId', SectionController.delete)
  }
}
export default new SectionRouter().router;
