import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

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
    folderPath = path.resolve(`./uploads/user-images/${userId}`);
  }

  if (requestPath.includes('/upload/event-images')) {
    const { eventId } = req.params;
    folderPath = path.resolve(`./uploads/event-images/${eventId}`);
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
      cb(null, folderPath);
    },
    filename: function (req: Request, file, cb) {
      const randomName = Math.random().toString(36).substring(7);
      const ext = path.extname(file.originalname);
      const fileName = randomName + ext;
      cb(null, fileName);
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fieldSize: 10 * 1024 * 1024 },
  }).array('files', 5);

  upload(req, res, function (err) {
    if (err) {
      console.error('Dosya yükleme hatası:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Dosya yükleme hatası.' });
    }
    next();
  });
};
