import { FindOneOptions } from 'typeorm';
import { AppDataSource } from '../../../data.source';
import { RegisterRequest } from '../../libs/types/auth/requests/register.request';
import { UserModel } from './models/user.model';

export class UserService {
  constructor() {}

  private readonly userRepository = AppDataSource.getRepository(UserModel);

  public async create(data: Omit<RegisterRequest, 'confirmPassword'>) {
    try {
      return await this.userRepository.save(data);
    } catch (error) {
      throw error;
    }
  }

  public async findOneBy(data: FindOneOptions<UserModel>) {
    try {
      return await this.userRepository.findOne(data);
    } catch (error) {
      throw error;
    }
  }
}
