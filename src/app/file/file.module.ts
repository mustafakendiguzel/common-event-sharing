import { RabbitMqService } from '../../libs/rabbitmq/rabbitmq.service';
import { EventService } from '../event/event.service';
import { FileController } from './file.controller';
import { FileRouter } from './file.routes';
import { FileService } from './file.service';

const fileService = new FileService();

const eventService = new EventService();

const rabbitMqService = new RabbitMqService(eventService);

const fileController = new FileController(
  fileService,
  eventService,
  rabbitMqService
);
const fileRouter = new FileRouter(fileController);

export default {
  service: fileService,
  controller: fileController,
  router: fileRouter.getRouter(),
};
