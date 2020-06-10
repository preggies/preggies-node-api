import { factory } from 'factory-girl';
import '../../test/factories/user';
import application, {
  JSON_TYPE,
  parsedSingleResponse,
  parsedArrayResponse,
} from '../../test/utils/requestHelpers';
import { MOUNT_POINT } from './routes';
import { getFields } from '../../test/utils/queryHelpers';
import { verifyResponse, verifyUser } from '../../test/helpers/users';
import User from '../persistence/mongoose/User/model';

let app, request;

describe('Users', () => {
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

  describe('Create', () => {
    it('Create User', async () => {
      const payload = await factory.attrs('User');
      const response = await request.post(MOUNT_POINT).send(payload);

      expect(response.status).toBe(201);
      expect(response.res.statusMessage).toBe('Created');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const user = parsedSingleResponse(response);

      expect(user).toHaveProperty('fullname');
      expect(user).toHaveProperty('email');
      expect(user['fullname']).toEqual(payload['fullname']);
      expect(user['email']).toEqual(payload['email']);
      expect(user.id).toBeValidObjectId();
    });

    it('Cannot create User', async () => {
      const payload = await factory.attrs('User', { fullname: null });
      const response = await request.post(MOUNT_POINT).send(payload);

      expect(response.status).toBe(422);
      expect(response.res.statusMessage).toBe('Unprocessable Entity');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
    });

    it('Terminates req when validation error occurs', async () => {
      const countBeforeAttempt = await User.countDocuments();
      const payload = await factory.attrs('User', { fullname: null });
      const response = await request.post(MOUNT_POINT).send(payload);

      expect(response.status).toBe(422);
      expect(response.res.statusMessage).toBe('Unprocessable Entity');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
      expect(response.text).toMatch(/Invalid\srequest/i);

      expect(await User.countDocuments()).toEqual(countBeforeAttempt);
    });

    it('Cannot create User when password is not valid', async () => {
      const payload = await factory.attrs('User', { password: null });
      const response = await request.post(MOUNT_POINT).send(payload);

      expect(response.status).toBe(422);
      expect(response.res.statusMessage).toBe('Unprocessable Entity');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
    });

    it('Cannot create User when email is not valid', async () => {
      const payload = await factory.attrs('User', { email: null });
      const response = await request.post(MOUNT_POINT).send(payload);

      expect(response.status).toBe(422);
      expect(response.res.statusMessage).toBe('Unprocessable Entity');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
    });
  });

  describe('findAll', () => {
    const payload = {
      limit: 20,
      page: 1,
      role: null,
    };

    it('finds all users in the db', async () => {
      await factory.createMany('User', 5);

      const response = await request.get(MOUNT_POINT).query(payload);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const users = parsedArrayResponse(response);

      users.forEach(verifyUser);
    });

    it('all users returned matches with what is in DB', async () => {
      const insertedUsers = await factory.createMany('User', 5);

      const response = await request.get(MOUNT_POINT).query(payload);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const users = parsedArrayResponse(response);

      ['fullname', 'email', 'meta.active', 'id'].forEach(k => {
        expect(getFields(users, k)).containExactly(getFields(insertedUsers, k));
      });
    });

    it('all users returned has their id unmodified', async () => {
      const insertedUsers = await factory.createMany('User', 5);

      const response = await request.get(MOUNT_POINT).query(payload);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const users = parsedArrayResponse(response);

      users.forEach(({ id }) => expect(id).toBeValidObjectId);
      expect(getFields(users, 'id')).containExactly(getFields(insertedUsers, 'id'));
    });

    it('correctly paginates response', async () => {
      payload.limit = 3;

      const insertedUsers = await factory.createMany('User', 5);

      const response = await request.get(MOUNT_POINT).query(payload);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const users = parsedArrayResponse(response);

      expect(users.length).not.toEqual(insertedUsers.length);
      expect(users.length).toEqual(payload.limit);
      users.forEach(({ id }) => expect(id).toBeValidObjectId);
    });

    it('returns only users with role id', async () => {
      payload.role = '5c3cab69ffb5bd22494a8484';

      const usersWithKnownRole = await factory.createMany('User', payload.limit);
      await factory.createMany('User', 2, { role: '5c3cab69ffb5bd22494a8487' });

      const response = await request.get(MOUNT_POINT).query(payload);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const users = parsedArrayResponse(response);

      expect(users.length).toEqual(usersWithKnownRole.length);
      expect(users.length).toEqual(payload.limit);
      users.forEach(({ role }) => expect(role).not.toBe('5c3cab69ffb5bd22494a8487'));
    });

    it('it returns null when the users db is empty', async () => {
      const response = await request.get(MOUNT_POINT).query(payload);

      expect(response.statusCode).toBe(404);
      expect(response.res.statusMessage).toBe('Not Found');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
    });
  });

  describe('findById', () => {
    it('finds a User by its id', async () => {
      const createdUsers = await factory.createMany('User', 5);

      const id = createdUsers[2]['id'];

      const response = await request.get(`${MOUNT_POINT}/${id}`);

      expect(response.statusCode).toBe(200);
      expect(response.res.statusMessage).toBe('OK');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);

      const user = parsedSingleResponse(response);

      expect(user.id).toBeValidObjectId();
      expect(user.meta.active).toBe(true);
      verifyUser(user);
      verifyResponse(user, createdUsers[2]);
    });

    it('should not find a user with an invalid id', async () => {
      await factory.createMany('User', 5);
      const id = '5c3cad20a5676122753b33ba';

      const response = await request.get(`${MOUNT_POINT}/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.res.statusMessage).toBe('Not Found');
      expect(response.headers['content-type']).toEqual(JSON_TYPE);
    });
  });
});
