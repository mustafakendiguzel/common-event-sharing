import { FindOneOptions } from 'typeorm';
import { AppDataSource } from '../../../data.source';
import { RegisterRequest } from '../../libs/types/auth/requests/register.request';
import { UserModel } from './models/user.model';

export class UserService {
  constructor() {}

  public async create(data: Omit<RegisterRequest, 'confirmPassword'>) {
    try {
      const userRepository = AppDataSource.getRepository(UserModel);
      return await userRepository.save(data);
    } catch (error) {
      throw error;
    }
  }

  public async findOneBy(data: FindOneOptions<UserModel>) {
    try {
      const userRepository = AppDataSource.getRepository(UserModel);
      return await userRepository.findOne(data);
    } catch (error) {
      throw error;
    }
  }
}
