export type RequestError = {
  message?: string;
  response?: {
    status?: number;
    data?: any;
    statusText?: string;
  };
};

export class HttpError {
  static error(error?: RequestError): HttpError | null {
    if (error) {
      return new HttpError(
        error.response?.data,
        error.response?.status,
        error.response?.data,
        error.response?.statusText
      );
    }
    return null;
  }

  constructor(
    public message: string = '',
    public statusCode: number = 0,
    public error: any = null,
    public statusText: string = ''
  ) {}
}

export enum ErrorMessages {
  NOT_FOUND = 'Not Found',
  TOKEN_EXPIRED = 'Token is invalid. Please start session again.',
  UNEXPECTED_ERROR = 'Oops, something is wrong.',
}
