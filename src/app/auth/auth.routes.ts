import express from 'express';
import { AuthController } from './auth.controller';
import { RegisterRequest } from '../../libs/types/auth/requests/register.request';
import { validateRequest } from '../../helpers/middlewares/validate-request.middleware';
import { plainToClass } from 'class-transformer';
import { LoginRequest } from '../../libs/types/auth/requests/login.request';

export class AuthRouter {
  constructor(private readonly authController: AuthController) {}

  getRouter() {
    const router = express.Router();
    router
      .route('/register')
      .post(
        validateRequest(RegisterRequest),
        this.authController.register.bind(this.authController)
      );
    router
      .route('/login')

      .post(
        validateRequest(LoginRequest),
        this.authController.login.bind(this.authController)
      );
    return router;
  }
}
