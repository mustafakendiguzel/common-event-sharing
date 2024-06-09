import { AppDataSource } from '../../../data.source';
import { ProfilePhotoModel } from './models/file.model';
import { ProfilePhotoUploadRequest } from '../../libs/types/file/requests/profile-photo-upload.request';
import { EventPhotoModel } from '../event/models/event-photo.model';
import { CreateEventPhotoRequest } from '../../libs/types/file/requests/create-event-photo.request';
import { exec } from 'child_process';

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

  public async tagPhotoToEvent(eventId: string, photoId: string) {
    exec(
      'conda run -n py39 python  src/libs/face_recognition/detector.py --test -f src/libs/face_recognition/testing/2.jpg',
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Hata oluştu: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Hata çıktısı: ${stderr}`);
          return;
        }
        console.log(`Python çıktısı: ${stdout}`);
      }
    );
  }
}
