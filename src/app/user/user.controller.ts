import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { EventService } from '../event/event.service';

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {}

  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { id: publisherId } = req.user;

      const user = await this.userService.findOneBy({
        where: { id: userId },
        relations: {
          profilePhotos: true,
        },
      });

      const events = await this.eventService.getEventBy({
        where: [
          { publisherId: userId, isPublic: true },
          { isPublic: false, publisherId },
        ],
        relations: { publisher: true, eventPhotos: { eventUsers: true } },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'Kullanıcı bulunamadı.' });
      }
      const { password, ...userData } = user;

      return res
        .status(200)
        .json({ success: true, data: { ...userData, events } });
    } catch (error) {
      next(error);
    }
  }
}
