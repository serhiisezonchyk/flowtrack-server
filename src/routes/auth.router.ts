import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { validateData } from '../middleware/validateData';
import { signUpSchema } from '../schemas/userSchemas';

class AuthRoutes {
  router = Router();
  controller = new AuthController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/sign-up', validateData(signUpSchema), this.controller.signUp);
    this.router.post('/sign-in', this.controller.signIn);
    this.router.post('/logout', this.controller.logout);
    this.router.post('/refresh', this.controller.refresh);
  }
}

export default new AuthRoutes().router;
