import { exec } from 'child_process';
import { UserService } from '../user/user.service';
import { RegisterRequest } from '../../libs/types/auth/requests/register.request';
import { CustomError } from '../../helpers/error-handle/errors/custom-error';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { LoginRequest } from '../../libs/types/auth/requests/login.request';

config();

export class AuthService {
  constructor(private readonly userService: UserService) {}

  private readonly JWT_SECRET = process.env.JWT_SECRET;

  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

  public getProducts() {
    this.runPythonCode();
    return {};
  }

  public async register(data: RegisterRequest) {
    if (data.password !== data.confirmPassword) {
      throw new CustomError('Passwords do not match', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.userService.create({ ...data, password: hashedPassword });
  }

  public async login(data: LoginRequest) {
    const { email, password } = data;

    const user = await this.userService.findOneBy({ where: { email } });
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new CustomError('Invalid password', 400);
    }

    if (!this.JWT_SECRET) {
      throw new CustomError('JWT_SECRET must be provided', 400);
    }

    var token = jwt.sign({ id: user.id }, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });

    return { accessToken: token };
  }

  runPythonCode() {
    exec(
      'conda run -n py39 python  src/libs/face_recognition/detector.py --test -f src/libs/face_recognition/testing/1.jpg',
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
