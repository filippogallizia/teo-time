import events from 'events';

import jwt from 'jsonwebtoken';

import { UserDTO, UserInputDTO } from '../interfaces/UserDTO';
import { ApiError } from './ErrorHanlderService';

const db = require('../database/models/db');

const UserModel = db.user;

const eventEmitter = new events.EventEmitter();

class AuthService {
  public userExist(user: UserDTO | undefined) {
    if (user) {
      throw ApiError.badRequest('User already Exist');
    }
  }

  public errorUserNotFound(user: UserDTO | undefined) {
    if (!user) {
      throw ApiError.badRequest('User not found');
    }
  }

  public signUp(user: UserDTO | undefined, userInput: UserInputDTO) {
    this.userExist(user);
    const { email } = userInput;
    /**
     * to do => change admin rules
     */
    const adminOrUser =
      email === 'galliziafilippo@gmail.com' ? 'admin' : 'user';

    UserModel.create({ ...userInput, role: adminOrUser }).catch((e: any) => {
      throw e.toString();
    });
  }

  public generateAccessToken(value: any) {
    return jwt.sign(value, process.env.ACCESS_TOKEN_SECRET as string);
  }
}

export default new AuthService();
