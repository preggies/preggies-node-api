import application from '../../test/utils/requestHelpers';
import { MOUNT_POINT } from './routes';

let app, request;

describe('Monitoring', () => {
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

  it('should send ok when app is healthy', async () => {
    const response = await request.get(`${MOUNT_POINT}/healthz`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body['status']).toBe('OK');
  });

  it('should respond with ok when app is alive and DB is down', async () => {
    const db = await app.db;
    await db.disconnect();
    const response = await request.get(`${MOUNT_POINT}/healthz`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body['status']).toBe('OK');
  });
});
