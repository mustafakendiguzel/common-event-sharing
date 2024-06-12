import { EventService } from '../event/event.service';
import { UserController } from './user.controller';
import { UserRouter } from './user.routes';
import { UserService } from './user.service';

const userService = new UserService();
const eventService = new EventService();
const userController = new UserController(userService, eventService);
const eventRouter = new UserRouter(userController);

export default {
  service: userService,
  controller: userController,
  router: eventRouter.getRouter(),
};
