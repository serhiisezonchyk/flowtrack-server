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
    this.router.put('/:boardId', SectionController.updatePositions);
  }
}
export default new SectionRouter().router;
