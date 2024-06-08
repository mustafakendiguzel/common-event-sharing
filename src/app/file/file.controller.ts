import { Request, Response } from 'express';
import { FileService } from './file.service';

export class FileController {
  constructor(private readonly fileService: FileService) {}

  public save(req: Request, res: Response) {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Yüklenecek dosya bulunamadı.' });
    }

    return res.json({ success: true, message: 'Dosyalar başarıyla yüklendi.' });
  }
}
