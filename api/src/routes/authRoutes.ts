import { Request, Response, Router } from 'express';

import Auth from '../services/authService/AuthService';
import { ResponseWithUserType } from './interfaces/interfaces';

const { userExist, createToken } = require('../middleware/middleware');
const db = require('../database/models/db');

const route = Router();

//export default (app: Router) => {
//  app.use('/login', route);
//  route.post(
//    '/',
//    [userExist, createToken],
//    (req: Request, res: ResponseWithUserType) => {
//      try {
//        Auth.errorUserNotFound(res.user);
//        res.status(200).send({ user: res.user, token: res.locals.jwt_secret });
//      } catch (e) {
//        console.log(e, 'aqui');
//        res.status(500).send({
//          success: false,
//          error: {
//            message: e,
//          },
//        });
//      }
//    }
//  );
//};
