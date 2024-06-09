import { FindOneOptions } from 'typeorm';
import { AppDataSource } from '../../../data.source';
import { CreateEventRequest } from '../../libs/types/event/request/create-event.request';
import { EventModel } from './models/event.model';
import { EventPhotoModel } from './models/event-photo.model';

export class EventService {
  constructor() {}

  private readonly eventRepository = AppDataSource.getRepository(EventModel);
  private readonly eventPhotoRepository =
    AppDataSource.getRepository(EventPhotoModel);

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
        where: { publisherId },
        relations: { eventPhotos: true },
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
}
