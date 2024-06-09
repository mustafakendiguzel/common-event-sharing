import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateEventRequest {
  @Type(() => String)
  publisherId: string;

  @IsString()
  latCord: string;

  @IsString()
  longCord: string;

  @IsString()
  title: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  desc?: string;
}
