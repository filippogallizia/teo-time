import { LoggerService } from './LoggerService';

export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export class ErrorService {
  code: any;
  message: any;
  constructor(code: any, message: any) {
    this.code = code;
    this.message = message;
  }

  static unauthorized(msg: any) {
    return new ErrorService(401, msg);
  }

  static badRequest(msg: any) {
    return new ErrorService(400, msg);
  }

  static internal(msg: any) {
    return new ErrorService(500, msg);
  }
}

export function apiErrorHandler(err: any, req: any, res: any, next: any) {
  // in prod, don't use console.log or console.err because
  // it is not async
  if (err instanceof ErrorService) {
    res.status(err.code).json(err.message);
    return;
  }
  console.log(err, 'ERROR FROM GENERAL HANDLER');
  res.status(500).json('something went wrong');
}
