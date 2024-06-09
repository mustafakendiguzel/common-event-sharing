import { Request, Response } from 'express';
import { EventService } from './event.service';

export class EventController {
  constructor(private readonly eventService: EventService) {}

  public async createEvent(req: Request, res: Response) {
    const { id: userId } = req.user;

    await this.eventService.createEvent({ ...req.body, publisherId: userId });

    return res.json({
      success: true,
      message: 'Etkinlik başarıyla oluşturuldu.',
    });
  }

  public async getEvents(req: Request, res: Response) {
    const { id: userId } = req.user;

    const events = await this.eventService.getEvents(userId);

    return res.json({ success: true, data: events });
  }
}
