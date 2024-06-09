import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateEventUserRequest {
  @IsNumber()
  xCord1: number;

  @IsNumber()
  xCord2: number;

  @IsString()
  eventPhotoId: string;

  @IsBoolean()
  userId: string;
}
