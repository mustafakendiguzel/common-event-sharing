import express from 'express';
import { FileController } from './file.controller';
import { FileService } from './file.service';

export class FileRouter {
  constructor(
    private readonly fileService: FileService,
    private readonly fileController: FileController
  ) {}

  getRouter() {
    const router = express.Router();
    router
      .route('/upload')
      .post(
        this.fileService.getMulterMiddleware(),
        this.fileController.save.bind(this.fileController)
      );
    return router;
  }
}
