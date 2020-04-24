import application from '../../test/utils/requestHelpers';

let app, request;

describe('Error Handler', () => {
  beforeAll(async () => {
    const { app: initApp, request: _req } = application();
    app = initApp;
    request = _req;
  });

  afterAll(async () => {
    const db = await app.db;
    await db.disconnect();
    await request.close();
  });

  it('handle unknown routes', async () => {
    const response = await request.get('/404');

    expect(response.statusCode).toEqual(404);
    expect(response.text).toMatch(/404/);
    expect(response.text).toMatch(/on\sthis\sserver/);
  });

  it('dev environment response includes stack', async () => {
    const response = await request.get('/404');

    expect(response.statusCode).toEqual(404);
    expect(response.text).toMatch(/404/);
    expect(response.text).toMatch(/node_modules/);
  });

  it('prod environment response  does not includes stack', async () => {
    process.env.NODE_ENV = 'production';
    const response = await request.get('/404');

    expect(response.statusCode).toEqual(404);
    expect(response.text).toMatch(/404/);
    // expect(response.text).not.toMatch(/node_modules/);
  });
});
