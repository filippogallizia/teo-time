import express from 'express';

export const isDevEnvironment = () => {
  return process.env.NODE_ENV === 'development';
};

export const handleResponse = (res: express.Response, data: any) =>
  res.status(200).send(data);

export const handleError = (res: express.Response, err: any) =>
  res.status(500).send(err);
