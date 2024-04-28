import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthRouter } from './auth.routes';
import { AuthService } from './auth.service';

const userService = new UserService();
const authService = new AuthService(userService);
const authController = new AuthController(authService);
const authRouter = new AuthRouter(authController);

export default {
  service: authService,
  controller: authController,
  router: authRouter.getRouter(),
};
