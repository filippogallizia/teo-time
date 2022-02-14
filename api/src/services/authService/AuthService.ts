import jwt from 'jsonwebtoken';

import { LoginInputDTO, UserDTO, UserInputDTO } from '../../interfaces/UserDTO';
import { ErrorService } from '../errorService/ErrorService';
import userService from '../userService/UserService';

class AuthService {
  public userExist(user: UserDTO | undefined) {
    if (user) {
      throw ErrorService.badRequest('User already Exist');
    }
    return;
  }

  public passwordExist(password: string) {
    if (!password) {
      throw ErrorService.badRequest('Password is missing');
    }
  }
  public passwordValidation(passwordDatabase: string, passwordInput: string) {
    if (passwordDatabase !== passwordInput) {
      throw ErrorService.badRequest('Password is wrong');
    }
  }
  public emailValidation(email: string) {
    if (!email) {
      throw ErrorService.badRequest('Email is missing');
    }
  }
  public nameValidation(name: string) {
    if (!name) {
      throw ErrorService.badRequest('UserName is missing');
    }
  }
  public phoneNumberValidation(phoneNumber: string) {
    if (!phoneNumber) {
      throw ErrorService.badRequest('PhoneNumber is missing');
    }
  }

  public userInputValidation(userInput: UserInputDTO) {
    const { password, email, name, phoneNumber } = userInput;
    this.passwordExist(password);
    this.nameValidation(name);
    this.phoneNumberValidation(phoneNumber);
    this.emailValidation(email);
  }

  public errorUserNotFound(user: UserDTO | undefined) {
    if (!user) {
      throw ErrorService.badRequest('User not found');
    }
  }

  public async signUp(
    user: UserDTO | undefined,
    userInput: UserInputDTO
  ): Promise<void> {
    this.userExist(user);
    this.userInputValidation(userInput);
    await userService.create(userInput);
  }

  public async login(loginInput: LoginInputDTO): Promise<UserDTO> {
    const { email, password } = loginInput;
    this.emailValidation(email);
    this.passwordExist(password);
    const usr = await userService.findOne(email);
    if (!usr) {
      throw ErrorService.badRequest('User not exist');
    }
    this.passwordValidation(usr.password, password);
    this.errorUserNotFound(usr);
    return usr;
  }

  public generateAccessToken(value: any) {
    return jwt.sign(
      //expiration one hour
      { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: value },
      process.env.ACCESS_TOKEN_SECRET as string
    );
  }
}

export default new AuthService();
