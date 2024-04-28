import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register(req: Request, res: Response) {
    res.json(this.authService.getProducts());
  }
}
