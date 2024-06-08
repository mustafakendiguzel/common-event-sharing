import multer from 'multer';
import { AppDataSource } from '../../../data.source';
import { ProfilePhotoModel } from './models/file.model';
import { ProfilePhotoUploadRequest } from '../../libs/types/file/requests/profile-photo-upload.request';

export class FileService {
  constructor() {}

  private readonly userRepository =
    AppDataSource.getRepository(ProfilePhotoModel);

  public async uploadProfilePhoto(data: ProfilePhotoUploadRequest) {
    try {
      return await this.userRepository.save(data);
    } catch (error) {
      throw error;
    }
  }
}
