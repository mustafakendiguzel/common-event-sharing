import { NextFunction, Request, Response } from 'express';
import { FileService } from './file.service';
import path from 'path';
import { EventService } from '../event/event.service';
import { RabbitMqService } from '../../libs/rabbitmq/rabbitmq.service';
import sharp from 'sharp';

export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly eventService: EventService,
    private readonly rabbitMqService: RabbitMqService
  ) {
    rabbitMqService.connectRabbitMq();
  }

  public async uploadProfilePhoto(req: Request, res: Response) {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Yüklenecek dosya bulunamadı.' });
    }

    const files = req.files as Express.Multer.File[];
    const { id: userId } = req.user;
    const queueName = 'train-photos';

    const queueCount = await this.rabbitMqService.checkQueueCount(queueName);

    if (queueCount < 2) {
      await this.rabbitMqService.sendToQueue(queueName, '{}');
    }

    files.forEach((file) => {
      const userImagePath = `${file.filename}`;

      this.fileService.uploadProfilePhoto({
        userId,
        path: userImagePath,
      });
    });

    return res.json({ success: true, message: 'Dosyalar başarıyla yüklendi.' });
  }

  public getProfilePhoto(req: Request, res: Response) {
    const { userId } = req.params;
    const { fileName } = req.params;
    const userImagePath = path.resolve(
      `./src/libs/face_recognition/training/${userId}/${fileName}`
    );

    return res.sendFile(userImagePath);
  }

  public async createEventPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { eventId } = req.params;

      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: 'Yüklenecek dosya bulunamadı.' });
      }

      if (!eventId)
        return res
          .status(400)
          .json({ success: false, message: 'Etkinlik kimliği belirtilmedi.' });

      const eventExists = await this.eventService.getEventBy({
        where: { id: eventId },
      });

      if (!eventExists)
        return res
          .status(400)
          .json({ success: false, message: 'Etkinlik bulunamadı.' });

      const files = req.files as Express.Multer.File[];

      files.forEach(async (file) => {
        const eventImagePath = `${file.filename}`;


        const eventPhoto = await this.fileService.createEventPhoto({
          eventId,
          path: eventImagePath,
        });

        const messageObject = {
          eventId,
          fileName: file.filename,
          eventPhotoId: eventPhoto.id,
        };

        await this.rabbitMqService.sendToQueue(
          'tag-photo-to-event',
          JSON.stringify(messageObject)
        );
      });

      return res.json({
        success: true,
        message: 'Dosyalar başarıyla yüklendi.',
      });
    } catch (error) {
      next(error);
    }
  }

  public async getEventImagePhoto(req: Request, res: Response) {
    const { fileName } = req.params;

    const eventPhoto = await this.eventService.getEventPhotoBy({
      where: { path: fileName },
    });

    const eventImagePath = path.resolve(
      `./src/libs/face_recognition/testing/${eventPhoto?.eventId}/${fileName}`
    );

    return res.sendFile(eventImagePath);
  }
}
