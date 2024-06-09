import { IsEmail, IsString } from 'class-validator';

export class CreateEventPhotoRequest {
  @IsString()
  eventId: string;

  @IsString()
  path: string;
}
