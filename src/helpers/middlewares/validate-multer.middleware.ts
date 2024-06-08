import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { join } from 'path';

export const validateMulter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    path,
    user: { id: userId },
  } = req;

  let folderPath: string = '';

  if (path.includes('/upload/user-images')) {
    folderPath = join(__dirname, `../../uploads/user-images/${userId}`); // Ana dizini al ve klasör yolu oluştur
  }

  if (path.includes('/upload/event-images')) {
    const { eventId } = req.body;
    folderPath = join(__dirname, `../../uploads/event/${eventId}`); // Ana dizini al ve klasör yolu oluştur
  }

  console.log('folderPath:', folderPath);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
      cb(null, folderPath);
    },
    filename: function (req: Request, file, cb) {
      cb(null, file.originalname);
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
