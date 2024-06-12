import { Request, Response } from 'express';
import { EventService } from './event.service';

export class EventController {
  constructor(private readonly eventService: EventService) {}

  public async createEvent(req: Request, res: Response) {
    const { id: userId } = req.user;

    const { id } = await this.eventService.createEvent({
      ...req.body,
      publisherId: userId,
    });

    return res.json({
      success: true,
      data: {
        event: { id },
      },
    });
  }

  public async getEvents(req: Request, res: Response) {
    const { id: userId } = req.user;
    const { getMe } = req.query;

    const events = await this.eventService.getEvents(
      userId,
      getMe == undefined ? false : true
    );

    return res.json({ success: true, data: events });
  }
}
