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

    const events = await this.eventService.getEvents(userId);

    return res.json({ success: true, data: events });
  }

  public async deleteEvent(req: Request, res: Response) {
    const { eventId } = req.params;

    await this.eventService.deleteEvent(eventId);

    return res.json({ success: true });
  }

  public async deleteEventPhoto(req: Request, res: Response) {
    const { eventId, eventPhotoId } = req.params;

    await this.eventService.deleteEventPhoto(eventPhotoId);

    return res.json({ success: true });
  }
}
