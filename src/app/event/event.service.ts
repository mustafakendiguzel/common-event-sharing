import { FindOneOptions } from 'typeorm';
import { AppDataSource } from '../../../data.source';
import { CreateEventRequest } from '../../libs/types/event/request/create-event.request';
import { EventModel } from './models/event.model';
import { EventPhotoModel } from './models/event-photo.model';
import { EventUserModel } from './models/event-user.model';
import { CreateEventUserRequest } from '../../libs/types/event/request/create-event-user.request';

export class EventService {
  constructor() {}

  private readonly eventRepository = AppDataSource.getRepository(EventModel);

  private readonly eventPhotoRepository =
    AppDataSource.getRepository(EventPhotoModel);

  private readonly eventUserRepository =
    AppDataSource.getRepository(EventUserModel);

  public async createEvent(data: CreateEventRequest) {
    try {
      return await this.eventRepository.save(data);
    } catch (error) {
      throw error;
    }
  }

  public async getEvents(publisherId: string) {
    try {
      return await this.eventRepository.find({
        where: [{ publisherId, isPublic: false }, { isPublic: true }],
        relations: { publisher: true, eventPhotos: { eventUsers: true } },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getEventBy(findOneOptions: FindOneOptions<EventModel>) {
    try {
      return await this.eventRepository.findOne(findOneOptions);
    } catch (error) {
      throw error;
    }
  }

  public async getEventPhotoBy(
    findOneOptions: FindOneOptions<EventPhotoModel>
  ) {
    try {
      return await this.eventPhotoRepository.findOne(findOneOptions);
    } catch (error) {
      throw error;
    }
  }

  public async createEventUser(data: CreateEventUserRequest) {
    try {
      return await this.eventUserRepository.save(data);
    } catch (error) {
      throw error;
    }
  }

  public async updateEvent(eventId: string, data: Partial<EventModel>) {
    try {
      return await this.eventRepository.update(eventId, data);
    } catch (error) {
      throw error;
    }
  }
}
