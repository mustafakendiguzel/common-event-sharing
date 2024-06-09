import express from 'express';
import { FileController } from './file.controller';
import { verifyToken } from '../../helpers/middlewares/verify-user.middleware';
import { validateMulter } from '../../helpers/middlewares/validate-multer.middleware';

export class FileRouter {
  constructor(private readonly fileController: FileController) {}

  getRouter() {
    const router = express.Router();
    router
      .route('/upload/user-images')
      .post(
        verifyToken,
        validateMulter,
        this.fileController.uploadProfilePhoto.bind(this.fileController)
      );

    router
      .route('/user-images/:fileName')
      .get(
        verifyToken,
        this.fileController.getProfilePhoto.bind(this.fileController)
      );

    router
      .route('/upload/event-images/:eventId')
      .post(
        verifyToken,
        validateMulter,
        this.fileController.createEventPhoto.bind(this.fileController)
      );

    router
      .route('/event-images/:fileName')
      .get(
        verifyToken,
        this.fileController.getEventImagePhoto.bind(this.fileController)
      );

    router
      .route('/test-image-process')
      .get(this.fileController.testImageProcessing.bind(this.fileController));
    return router;
  }
}
