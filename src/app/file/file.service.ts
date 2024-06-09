import multer from 'multer';
import { AppDataSource } from '../../../data.source';
import { ProfilePhotoModel } from './models/file.model';
import { ProfilePhotoUploadRequest } from '../../libs/types/file/requests/profile-photo-upload.request';
import { EventPhotoModel } from '../event/models/event-photo.model';
import { CreateEventPhotoRequest } from '../../libs/types/file/requests/create-event-photo.request';

export class FileService {
  constructor() {}

  private readonly profilePhotoModel =
    AppDataSource.getRepository(ProfilePhotoModel);

  private readonly eventPhotoModel =
    AppDataSource.getRepository(EventPhotoModel);

  public async uploadProfilePhoto(data: ProfilePhotoUploadRequest) {
    try {
      return await this.profilePhotoModel.save(data);
    } catch (error) {
      throw error;
    }
  }

  public async createEventPhoto(data: CreateEventPhotoRequest) {
    try {
      return await this.eventPhotoModel.save(data);
    } catch (error) {
      throw error;
    }
  }
}
