import { IsEmail, IsString } from 'class-validator';

export class RegisterRequest {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;
}
