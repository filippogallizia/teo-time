import express, { NextFunction, Request, Router } from 'express';

import { createToken, loginValidation } from '../../middleware/middleware';
//import { googleAuth } from '../../middleware/middleware';
import authService from '../../services/authService/AuthService';
import { ErrorService } from '../../services/errorService/ErrorService';
import userService from '../../services/userService/UserService';
import { ResponseWithUserType } from '../interfaces/interfaces';

const AuthRouter = express.Router();

export default (app: Router) => {
  app.use('/', AuthRouter);

  AuthRouter.post(
    '/signup',
    async (req: Request, res: ResponseWithUserType, next: NextFunction) => {
      const { email, password, phoneNumber, name } = req.body;
      const user = await userService.findOne(email);
      if (user) {
        next(ErrorService.badRequest('User already exist'));
      }

      try {
        await authService.signUp(user, {
          email,
          password,
          phoneNumber,
          name,
        });
        res.send({ message: 'User was registered successfully!' });
      } catch (e: any) {
        next(e);
      }
    }
  );

  AuthRouter.post(
    '/login',
    [loginValidation, createToken],
    (req: Request, res: ResponseWithUserType, next: NextFunction) => {
      try {
        res.status(200).send({ user: res.user, token: res.locals.jwt_secret });
      } catch (e) {
        next(e);
      }
    }
  );

  //AuthRouter.get(
  //  '/google-login',
  //  async (req: Request, res: Response, next: NextFunction) => {
  //    try {
  //      const authHeader = req.header('Authorization');
  //      const token = authHeader && authHeader.split(' ')[1];
  //      if (token) {
  //        const googleUser = await googleAuth(token);
  //        if (!googleUser) {
  //          ErrorService.badRequest('Something went wrong in google login');
  //        } else {
  //          const user = await userService.findOne(googleUser.email);
  //          if (user) {
  //            res.status(200).send({ user: user, isGoogleLogin: true });
  //          } else {
  //            const { email, name } = googleUser;
  //            await userService.create({
  //              email,
  //              name,
  //            });
  //          }
  //        }
  //      }
  //    } catch (e) {
  //      next(e);
  //    }
  //  }
  //);
};
