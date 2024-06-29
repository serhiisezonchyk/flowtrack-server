import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { validateData } from '../middleware/validateData';
import { signUpSchema } from '../schemas/userSchemas';

class AuthRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/sign-up', validateData(signUpSchema), AuthController.signUp);
    this.router.post('/sign-in', AuthController.signIn);
    this.router.post('/logout', AuthController.logout);
    this.router.post('/refresh', AuthController.refresh);
    this.router.post('/google-sign-in', AuthController.googleSignIn);
  }
}

export default new AuthRoutes().router;
