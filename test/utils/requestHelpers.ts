import request from 'supertest';
import app from '../../src/server';

export default (): any => ({
  request: request(app),
  app,
});

export const parsedResponse = ({ body }): JSON => JSON.parse(body);

export const JSON_TYPE = 'application/json; charset=utf-8';
