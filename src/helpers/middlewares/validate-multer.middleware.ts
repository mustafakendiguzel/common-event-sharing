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

  
  upload(req, res, function (err) {
    if (err) {
      console.error('Dosya yükleme hatası:', err);

      return res
        .status(500)
        .json({ success: false, message: 'Dosya yükleme hatası.' });
    }
    (req.files as Express.Multer.File[]).forEach(file => {
      const randomName = Math.random().toString(36).substring(7);
      const randomFileName = file.filename = randomName + '.jpeg';
      sharp(file.buffer).resize(350, 450).rotate().toFile(folderPath + '/' + randomFileName);
    });
    next();
  });
};
