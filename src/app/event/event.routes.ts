import express from 'express';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { verifyToken } from '../../helpers/middlewares/verify-user.middleware';
import { validateRequest } from '../../helpers/middlewares/validate-request.middleware';
import { CreateEventRequest } from '../../libs/types/event/request/create-event.request';

export class EventRouter {
  constructor(
    private readonly eventService: EventService,
    private readonly eventController: EventController
  ) {}

  getRouter() {
    const router = express.Router();
    router.route('/').post(
      verifyToken,
      validateRequest(CreateEventRequest),

      this.eventController.createEvent.bind(this.eventController)
    );

    router
      .route('/')
      .get(
        verifyToken,
        this.eventController.getEvents.bind(this.eventController)
    );
    
    router.route('original/:eventId')
      .delete(
        verifyToken,
        this.eventController.deleteEvent.bind(this.eventController));
    
    router.route('eventPhoto/:eventPhotoId')
      .delete(
        verifyToken,
        this.eventController.deleteEvent.bind(this.eventController));

    return router;
  }
}
