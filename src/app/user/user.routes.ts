import express from 'express';
import { verifyToken } from '../../helpers/middlewares/verify-user.middleware';

import { UserController } from './user.controller';

export class UserRouter {
  constructor(private readonly userController: UserController) {}

  getRouter() {
    const router = express.Router();
    router
      .route('/:userId')
      .get(verifyToken, this.userController.getUser.bind(this.userController));

    return router;
  }
}
