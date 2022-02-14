import { expect } from 'chai';

import {
  LoginInputDTO,
  UserDTO,
  UserInputDTO,
} from '../../../interfaces/UserDTO';
import userService from '../../userService/UserService';
import authService from '../AuthService';

const userInput: UserInputDTO = {
  email: 'string',
  password: 'string',
  phoneNumber: 'string',
  name: 'string',
};

const userDto: UserDTO = {
  id: 1,
  password: 'string',
  email: 'string',
  name: 'string',
  phoneNumber: 'string',
  role: 'string',
  resetPasswordToken: 'string',
};

const loginInput: LoginInputDTO = {
  email: 'stirng',
  password: 'string',
};

describe('Auth Service', () => {
  // the tests container
  describe('test-1', () => {
    it('methods: password, email, name, user, phoneNumber', () => {
      /**
        the test always call the methods without param.
       */
      expect(authService.passwordExist).to.throw();
      expect(authService.emailValidation).to.throw();
      expect(authService.nameValidation).to.throw();
      expect(authService.userExist).to.not.throw();
      expect(authService.phoneNumberValidation).to.throw();
    });
  });

  describe('test-2', () => {
    it('method: userInputValidation', () => {
      authService.userInputValidation(userInput);
      expect(authService.passwordExist.call.length).equal(1);
      expect(authService.nameValidation.call.length).equal(1);
      expect(authService.phoneNumberValidation.call.length).equal(1);
      expect(authService.emailValidation.call.length).equal(1);
    });
  });

  describe('test-3', () => {
    it('method: signUp', () => {
      authService.signUp(userDto, userInput);
      expect(authService.userExist.call.length).equal(1);
      expect(authService.userInputValidation.call.length).equal(1);
      expect(userService.create.call.length).equal(1);
    });
  });

  describe('test-4', () => {
    it('method: login', () => {
      authService.login(loginInput);
      expect(authService.emailValidation.call.length).equal(1);
      expect(authService.passwordExist.call.length).equal(1);
      expect(userService.findOne.call.length).equal(1);
      expect(authService.passwordValidation.call.length).equal(1);
      expect(authService.errorUserNotFound.call.length).equal(1);
    });
  });

  /**
   * to figuered out
   */
  //describe('test-4', () => {
  //  it('method: generateAccessToken', () => {
  //    const encrypted = authService.generateAccessToken('password');
  //    expect(encrypted).to.be.not.equal('password');
  //  });
  //});
});
