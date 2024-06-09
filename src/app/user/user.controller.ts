import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const user = await this.userService.findOneBy({
        where: { id: userId },
        relations: {
          profilePhotos: true,
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'Kullanıcı bulunamadı.' });
      }
      const { password, ...userData } = user;

      return res.status(200).json({ success: true, data: userData });
    } catch (error) {
      next(error);
    }
  }
}
