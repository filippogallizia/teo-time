import { LoggerService } from './LoggerService';

export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export class ApiError {
  code: any;
  message: any;
  constructor(code: any, message: any) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg: any) {
    return new ApiError(400, msg);
  }

  static internal(msg: any) {
    return new ApiError(500, msg);
  }
}

export function apiErrorHandler(err: any, req: any, res: any, next: any) {
  // in prod, don't use console.log or console.err because
  // it is not async
  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  }
  //  LoggerService.error(err);
  res.status(500).json('something went wrong');
}
