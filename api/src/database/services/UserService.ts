/* eslint-disable no-useless-catch */

import { BookingDTO } from '../../interfaces/BookingDTO';
import { UserDTO, UserInputDTO } from '../../interfaces/UserDTO';
import { ApiError } from '../../services/ErrorHanlderService';

export type RecordType = UserDTO | BookingDTO;

class UserService {
  userModel: any;
  constructor(model: any) {
    this.userModel = model;
  }

  public async findOne(email: string): Promise<any> {
    try {
      return await this.userModel.findOne({ where: { email } });
    } catch (error) {
      throw ApiError.badRequest('User not found');
    }
  }

  public async findAll(
    searchParam: Record<string, unknown>
  ): Promise<RecordType[]> {
    return await this.userModel.findAll({
      where: { ...searchParam },
    });
  }

  public getRole(email: string) {
    return email === 'galliziafilippo@gmail.com' ? 'admin' : 'user';
  }

  public async create(
    user: UserDTO | undefined,
    userInput: UserInputDTO
  ): Promise<any> {
    const { email } = userInput;
    try {
      return await this.userModel.create({
        ...userInput,
        role: this.getRole(email),
      });
    } catch (e) {
      throw e;
    }
  }
}

export default UserService;
