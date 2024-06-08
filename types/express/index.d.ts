import { UserModel } from '../../src/app/user/models/user.model';
import { JwtResponse } from '../../src/libs/types/jwt.response';

declare global {
  namespace Express {
    interface Request {
      user: JwtResponse;
    }
  }
}
