import { NextFunction, Request, Response } from 'express';
import { FileService } from './file.service';
import path from 'path';
import { EventService } from '../event/event.service';

export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly eventService: EventService
  ) {}

  public uploadProfilePhoto(req: Request, res: Response) {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Yüklenecek dosya bulunamadı.' });
    }

    const files = req.files as Express.Multer.File[];
    const { id: userId } = req.user;

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
    const { id: userId } = req.user;
    const { fileName } = req.params;
    const userImagePath = path.resolve(
      `./uploads/user-images/${userId}/${fileName}`
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
      console.log('lansie', eventId);
      files.forEach((file) => {
        const eventImagePath = `${file.filename}`;

        this.fileService.createEventPhoto({
          eventId,
          path: eventImagePath,
        });
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
    const { id: userId } = req.user;
    const { fileName } = req.params;

    const eventPhoto = await this.eventService.getEventPhotoBy({
      where: { path: fileName },
    });

    const userImagePath = path.resolve(
      `./uploads/event-images/${eventPhoto?.eventId}/${fileName}`
    );

    return res.sendFile(userImagePath);
  }
}
