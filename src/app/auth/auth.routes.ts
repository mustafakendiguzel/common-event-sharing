import express from 'express';
import { AuthController } from './auth.controller';

export class AuthRouter {
  constructor(private readonly authController: AuthController) {}

  getRouter() {
    const router = express.Router();
    router
      .route('/register')
      .get(this.authController.register.bind(this.authController));
    return router;
  }
}
