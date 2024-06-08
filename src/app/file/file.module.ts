import { FileController } from './file.controller';
import { FileRouter } from './file.routes';
import { FileService } from './file.service';

const fileService = new FileService();
const fileController = new FileController(fileService);
const fileRouter = new FileRouter(fileService, fileController);

export default {
  service: fileService,
  controller: fileController,
  router: fileRouter.getRouter(),
};
