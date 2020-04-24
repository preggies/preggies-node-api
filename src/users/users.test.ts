import { factory } from 'factory-girl';
import '../../test/factories/user';
import application, { JSON_TYPE } from '../../test/utils/requestHelpers';
// import { verifyUser, verifyResponse } from '../persistence/mongoose/User/queries.test';
import { MOUNT_POINT } from './routes';
import { getFields } from '../../test/utils/queryHelpers';
import { verifyResponse, verifyUser } from '../../test/helpers/users';

let app, request;

describe('Users', () => {
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

  describe('Create', () => {
    it('Create User', async () => {
      const payload = await factory.attrs('User');
      const response = await request.post(MOUNT_POINT).send(payload);

      expect(response.status).toBe(201);
      expect(response.res.statusMessage).toBe('Created');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const {
        users: { 0: user },
      } = response.body;

      expect(user).toHaveProperty('fullname');
      expect(user).toHaveProperty('email');
      expect(user['fullname']).toEqual(payload['fullname']);
      expect(user['email']).toEqual(payload['email']);
      expect(user.uuid).toBeValidUUID();
    });

    it('Cannot create User', async () => {
      const payload = await factory.attrs('User', { fullname: null });
      const response = await request.post(MOUNT_POINT).send(payload);

      expect(response.status).toBe(422);
      expect(response.res.statusMessage).toBe('Unprocessable Entity');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
    });
  });

  describe('findAll', () => {
    it('finds all users in the db', async () => {
      await factory.createMany('User', 7);

      const response = await request.get(MOUNT_POINT);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const { users } = response.body;

      users.forEach(verifyUser);
    });

    it('all users returned matches with what is in DB', async () => {
      const insertedUsers = await factory.createMany('User', 7);

      const response = await request.get(MOUNT_POINT);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const { users } = response.body;

      ['fullname', 'email', 'meta.active', 'uuid'].forEach(k => {
        expect(getFields(users, k)).containExactly(getFields(insertedUsers, k));
      });
    });

    it('all users returned has their uuid unmodified', async () => {
      const insertedUsers = await factory.createMany('User', 7);

      const response = await request.get(MOUNT_POINT);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const { users } = response.body;

      users.forEach(({ uuid }) => expect(uuid).toBeValidUUID);
      expect(getFields(users, 'uuid')).containExactly(getFields(insertedUsers, 'uuid'));
    });

    it('it returns null when the users db is empty', async () => {
      const response = await request.get(MOUNT_POINT);

      expect(response.statusCode).toBe(404);
      expect(response.res.statusMessage).toBe('Not Found');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
    });
  });

  describe('findById', () => {
    it('finds a User by its uuid', async () => {
      const createdUsers = await factory.createMany('User', 5);

      const uuid = createdUsers[2]['uuid'];

      const response = await request.get(`${MOUNT_POINT}/${uuid}`);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const {
        users: { 0: user },
      } = response.body;

      expect(user.uuid).toBeValidUUID();
      expect(user.meta.active).toBe(true);
      verifyUser(user);
      verifyResponse(user, createdUsers[2]);
    });

    it('should not find a user with an invalid uuid', async () => {
      await factory.createMany('User', 5);
      const uuid = '02117187-a5d5-4681-b087-8b4b337d5b8d';

      const response = await request.get(`${MOUNT_POINT}/${uuid}`);

      expect(response.statusCode).toBe(404);
      expect(response.res.statusMessage).toBe('Not Found');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
    });
  });
});
