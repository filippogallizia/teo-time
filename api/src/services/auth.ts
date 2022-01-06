import events from 'events';

import { UserDTO, UserInputDTO } from '../interfaces/UserDTO';

const db = require('../database/models/db');

const UserModel = db.user;

const eventEmitter = new events.EventEmitter();

class Auth {
  public userExist(user: UserDTO | undefined) {
    if (user) {
      throw new Error('user already Exist').toString();
    }
  }
  public userDoesntExist(user: UserDTO | undefined) {
    if (!user) {
      throw new Error("user doesn't exist").toString();
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
}

export default new Auth();
