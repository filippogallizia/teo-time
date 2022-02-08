import express, { NextFunction, Request, Response, Router } from 'express';

import { changePwdEmail, sendEmail } from '../../config/sendGrid/config';
import { ErrorService } from '../../services/ErrorService';

const db = require('../../database/models/db');

const PasswordRouter = express.Router();
const { v4 } = require('uuid');

const User = db.user;
const OTP = v4();

export default (app: Router) => {
  app.use('/password', PasswordRouter);

  PasswordRouter.post(
    '/reset',
    async (req: Request, res: Response, next: NextFunction) => {
      const userEmail = req.body.email;
      try {
        const usr = User.findOne({ where: { email: userEmail } });
        if (usr) {
          const updateUser = async () => {
            usr.set({ resetPasswordToken: OTP });
            await usr.save();
          };
          updateUser();
          const EMAIL = changePwdEmail(userEmail, OTP);
          try {
            await sendEmail(EMAIL);
            res.send('Check your email!');
          } catch (error) {
            throw ErrorService.badRequest('Email not found');
          }
        } else {
          throw ErrorService.badRequest('User not found');
        }
      } catch (e: any) {
        next(e);
      }
    }
  );

  PasswordRouter.post(
    '/otp',
    async (req: Request, res: Response, next: NextFunction) => {
      const resetPasswordToken = req.body.resetPasswordToken;
      try {
        const usr = User.findOne({ where: { resetPasswordToken } });
        if (usr) {
          res.send('allowed to reset password');
        } else {
          throw ErrorService.badRequest('User not found');
        }
      } catch (e: any) {
        next(e);
      }
    }
  );

  PasswordRouter.post(
    '/new',
    async (req: Request, res: Response, next: NextFunction) => {
      const resetPasswordToken = req.body.resetPasswordToken;
      const newPassword = req.body.newPassword;
      try {
        const usr = await User.findOne({ where: { resetPasswordToken } });
        if (usr) {
          usr.set({ password: newPassword });
          await usr.save();
          res.send('password changed');
        } else {
          throw ErrorService.badRequest('User doesnt exists');
        }
      } catch (e: any) {
        next(e);
      }
    }
  );
};
