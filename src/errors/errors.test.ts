import application, { JSON_TYPE, parsedErrorResponse } from '../../test/utils/requestHelpers';

let app, request;

describe('Error Handler', () => {
  beforeAll(async () => {
    const { app: initApp, request: _req } = await application();
    app = initApp;
    request = _req;
  });

  afterAll(async () => {
    const db = await app.db;
    await db.disconnect();
    await request.close();
  });

  describe('404', () => {
    it('handle unknown routes', async () => {
      const response = await request.get('/404');

      expect(response.statusCode).toEqual(404);
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
      expect(response.body).toHaveProperty('error');

      const error = parsedErrorResponse(response);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('code');
      expect(error.message).toMatch(/on\sthis\sserver/);
      expect(error.code).toEqual(404);
    });

    it('include stack trace and error string in development', async () => {
      const response = await request.get('/404');

      expect(response.statusCode).toEqual(404);
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
      expect(response.body).toHaveProperty('error');

      const error = parsedErrorResponse(response);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('code');
      expect(error).toHaveProperty('stack');
      expect(error).toHaveProperty('error');
      expect(error.stack).toMatch(/node_modules/);
      expect(error.error).toMatch(/NotFound/);
    });

    it('exclude stack trace and error string in production', async () => {
      process.env.NODE_ENV = 'production';
      const response = await request.get('/404');

      expect(response.statusCode).toEqual(404);
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
      expect(response.body).toHaveProperty('error');

      const error = parsedErrorResponse(response);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('code');
      expect(error).not.toHaveProperty('stack');
      expect(error).not.toHaveProperty('error');
      expect(error.stack).toBe(undefined);
      expect(error.error).toBe(undefined);
      process.env.NODE_ENV = 'test';
    });
  });

  describe('500', () => {
    beforeAll(async () => {
      const db = await app.db;
      await db.disconnect();
    });

    it('handle error when something went wrong', async () => {
      const response = await request.get('/users');

      expect(response.statusCode).toEqual(500);
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
      expect(response.body).toHaveProperty('error');

      const error = parsedErrorResponse(response);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('code');
      expect(error.message).toMatch(/Topology is closed, please connect/);
      expect(error.code).toEqual(500);
    });

    it('include stack trace and error string in development', async () => {
      const response = await request.get('/users');

      expect(response.statusCode).toEqual(500);
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
      expect(response.body).toHaveProperty('error');

      const error = parsedErrorResponse(response);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('code');
      expect(error).toHaveProperty('stack');
      expect(error).toHaveProperty('error');
      expect(error.stack).toMatch(/node_modules/);
      expect(error.error).toMatch(/MongoError: Topology is closed, please connect/);
    });

    it('exclude stack trace and error string in production', async () => {
      process.env.NODE_ENV = 'production';
      const response = await request.get('/users');

      expect(response.statusCode).toEqual(500);
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
      expect(response.body).toHaveProperty('error');

      const error = parsedErrorResponse(response);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('code');
      expect(error).not.toHaveProperty('stack');
      expect(error).not.toHaveProperty('error');
      expect(error.stack).toBe(undefined);
      expect(error.error).toBe(undefined);
      process.env.NODE_ENV = 'test';
    });
  });
});
