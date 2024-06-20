import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const validateMulter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    path: requestPath,
    user: { id: userId },
  } = req;

  let folderPath: string = '';

  if (requestPath.includes('/upload/user-images')) {
    folderPath = path.resolve(`./src/libs/face_recognition/training/${userId}`);
  }

  if (requestPath.includes('/upload/event-images')) {
    const { eventId } = req.params;
    folderPath = path.resolve(`./src/libs/face_recognition/testing/${eventId}`);
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits: { fieldSize: 10 * 1024 * 1024 },
  }).array('files', 10);

  
  upload(req, res, async function (err) {
    if (err) {
      console.error('Dosya yükleme hatası:', err);

      return res
        .status(500)
        .json({ success: false, message: 'Dosya yükleme hatası.' });
    }

    try {
      // Tüm dosyaları asenkron olarak işle
      await Promise.all(
        (req.files as Express.Multer.File[]).map(async file => {
          const randomName = Math.random().toString(36).substring(7);
          const randomFileName = file.filename = randomName + '.jpeg';

          // Sharp ile işlemleri asenkron olarak yap
          await sharp(file.buffer)
            .resize(350, 450)
            .rotate() // Exif meta verilerine göre döndürme işlemi
            .toFile(folderPath + '/' + randomFileName);
        })
      );

      next(); // İşlem tamamlandıktan sonra bir sonraki middleware'e geç
    } catch (err) {
      console.error('Dosya işleme hatası:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Dosya işleme hatası.' });
    }
  });
  
};
