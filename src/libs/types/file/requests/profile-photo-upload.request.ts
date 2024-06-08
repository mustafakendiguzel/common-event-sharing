import { IsEmail, IsString } from 'class-validator';

export class ProfilePhotoUploadRequest {
  @IsString()
  userId: string;

  @IsString()
  path: string;
}
