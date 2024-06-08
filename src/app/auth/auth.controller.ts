import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { validate } from 'class-validator';
import { RegisterRequest } from '../../libs/types/auth/requests/register.request';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.register(req.body);
      return res.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginResponse = await this.authService.login(req.body);
      return res.status(200).json(loginResponse);
    } catch (error) {
      next(error);
    }
  }
}
