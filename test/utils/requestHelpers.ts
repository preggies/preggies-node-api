import request from 'supertest';
import application from '../../src/server';
import { factory } from 'factory-girl';

export default async (): Promise<any> => {
  const app = await application();

  return {
    request: request(app),
    app,
  };
};

export const parsedResponse = ({ body }): object | any => body;

export const parsedSingleResponse = (response): object | any => parsedResponse(response)['data'][0];

export const parsedArrayResponse = (response): object | any => parsedResponse(response)['data'];

export const parsedErrorResponse = (response): object | any => parsedResponse(response)['error'];

export const JSON_TYPE = 'application/json; charset=utf-8';

export const credentials = async (): Promise<object> => {
  const user = await factory.attrs('User');
  const { email, password } = user;
  await factory.create('User', user);
  return { email, password };
};
