import jwt from 'jsonwebtoken';

import { UserDTO, UserInputDTO } from '../interfaces/UserDTO';
import { ErrorService } from './ErrorService';
import UserService from './UserService';

class AuthService {
  public userExist(user: UserDTO | undefined) {
    if (user) {
      console.log(user);
      throw ErrorService.badRequest('User already Exist');
    }
  }

  public errorUserNotFound(user: UserDTO | undefined) {
    if (!user) {
      throw ErrorService.badRequest('User not found');
    }
  }

  public async signUp(user: UserDTO | undefined, userInput: UserInputDTO) {
    this.userExist(user);
    await UserService.create(userInput);
  }

  public generateAccessToken(value: any) {
    return jwt.sign(value, process.env.ACCESS_TOKEN_SECRET as string);
  }
}

export default new AuthService();
