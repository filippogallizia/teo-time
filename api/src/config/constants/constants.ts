import { isProduction } from '../environment/environment';

export const URL_SERVER = isProduction ? '/api' : '/';

export const URL_CLIENT = isProduction
  ? 'https://osteotherapy.it'
  : 'http://localhost:3000';
