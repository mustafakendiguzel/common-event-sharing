import { Request, Response } from 'express';
import { FileService } from './file.service';
import path from 'path';

export class FileController {
  constructor(private readonly fileService: FileService) {}

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
}
