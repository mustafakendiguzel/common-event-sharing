import { EventController } from './event.controller';
import { EventRouter } from './event.routes';
import { EventService } from './event.service';

const eventService = new EventService();
const eventController = new EventController(eventService);
const eventRouter = new EventRouter(eventService, eventController);

export default {
  service: eventService,
  controller: eventController,
  router: eventRouter.getRouter(),
};
