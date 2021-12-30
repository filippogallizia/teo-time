import express from 'express';

import { UserDTO } from '../../interfaces/UserDTO';

export type ResponseWithUserType = express.Response & {
  user?: UserDTO;
};

export type ResponseWithAvalType = express.Response & {
  availabilities?: any;
};
