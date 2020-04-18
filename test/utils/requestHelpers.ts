import request from 'supertest';
import app from '../../src/server';

export default (): any => ({
  request: request(app),
  app,
});
