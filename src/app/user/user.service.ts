import User from './models/user.model';

export class UserService {
  constructor() {}

  public async create() {
    try {
      return await User.create({
        name: 'John Doe',
        email: 'asd',
        password: 'asasd',
      });
    } catch (error) {
      console.log(error);
    }
  }
}
