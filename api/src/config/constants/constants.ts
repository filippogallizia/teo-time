import { isProduction, isTest } from '../environment/environment';

export const URL_SERVER = isTest || isProduction ? '/api' : '/';

export const URL_CLIENT =
  isTest || isProduction ? 'https://osteotherapy.it' : 'http://localhost:3000';
