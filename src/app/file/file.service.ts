import multer from 'multer';

export class FileService {
  constructor() {}

  public getMulterMiddleware() {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });

    return multer({
      storage: storage,
      limits: { fieldSize: 10 * 1024 * 1024 },
    }).array('files', 5);
  }
}
