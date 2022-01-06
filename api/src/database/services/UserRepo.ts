import { UserDTO } from '../../interfaces/UserDTO';
//const db = require('../models/db');
//console.log(db, 'db');

//const UserModel = db.user;

export default class UserRepo {
  public findOne(email: string, User: any): Promise<UserDTO> {
    return User.findOne({
      where: { email: email },
    });
  }
}
