const env: ProcessEnv = process.env as unknown as ProcessEnv;

type ProcessEnv = {
  NODE_ENV: 'development' | 'test' | 'production';
  // All inserted variables have to start with REACT_APP_
  REACT_APP_BASE_URL: string;
  REACT_APP_OAUTH2_REDIRECT_URI: string;
};

export const isProduction: boolean = env.NODE_ENV === 'production';
export const isDevelopment: boolean = env.NODE_ENV === 'development';
export const isTest: boolean = env.NODE_ENV === 'test';