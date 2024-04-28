import { exec } from 'child_process';
import { UserService } from '../user/user.service';

export class AuthService {
  constructor(private readonly userService: UserService) {}

  public getProducts() {
    const products = this.userService.create();
    this.runPythonCode();
    return { msg: products };
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
