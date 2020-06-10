import { factory } from 'factory-girl';

import '../../../../test/factories/user';
import queries from './queries';

import { mongooseConnect, dbConfig as config } from '@ehbraheem/api';
import { getFields } from '../../../../test/utils/queryHelpers';
import { verifyUser, verifyResponse } from '../../../../test/helpers/users';

let db, userQueries;

describe('Users queries', () => {
  beforeAll(async () => {
    db = await mongooseConnect(config);
    userQueries = queries(db);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('create', () => {
    it('can create a user', async () => {
      const payload = await factory.attrs('User');

      const user = await userQueries.create({ payload });

      expect(user).toBeDefined();

      verifyUser(user);
      verifyResponse(user, payload);
    });

    it('cannot create a user', async () => {
      const payload = await factory.attrs('User', { fullname: undefined });

      try {
        await expect(await (async () => userQueries.create({ payload }))()).resolves.toThrow();
      } catch ({ errors, name, message }) {
        expect(name).toBe('ValidationError');
        expect(message).toMatch(/`fullname` is required/);
        expect(errors).toHaveProperty('fullname');
        expect(errors['fullname']['path']).toBe('fullname');
        expect(errors['fullname']['kind']).toBe('required');
      }
    });
  });

  describe('findById', () => {
    it('can find a single user', async () => {
      const user = await factory.create('User');

      const findUser = await userQueries.findById({
        payload: { id: user.id },
      });

      expect(findUser).toBeDefined();
      verifyUser(findUser);

      verifyResponse(findUser, user);
    });

    it('should not find a user with an invalid id', async () => {
      const id = '5e594cf8a6d34546192af747';
      const res = await userQueries.findById({ payload: { id } });
      expect(res).toBe(null);
    });
  });

  describe('findAll', () => {
    const payload = {
      page: 1,
      limit: 20,
    };

    it('return all user in the DB', async () => {
      const insertedUsers = await factory.createMany('User', 5);
      const { docs: users } = await userQueries.findAll({ payload });

      expect(users).toHaveLength(5);
      users.forEach(verifyUser);

      ['fullname', 'email', 'meta.active', 'id'].forEach(k => {
        expect(getFields(users, k)).containExactly(getFields(insertedUsers, k));
      });
    });

    it('returns null when no users in the db', async () => {
      const { docs: users, totalDocs } = await userQueries.findAll({ payload });

      expect(users.length).toBeFalsy();
      expect(users).toHaveLength(0);
      expect(totalDocs).toEqual(0);
    });

    it('paginates query results', async () => {
      payload.limit = 5;
      const insertedUsers = await factory.createMany('User', 7);

      const { docs: users, totalDocs, limit } = await userQueries.findAll({
        payload,
      });

      expect(users.length).not.toEqual(insertedUsers.length);
      expect(users).toHaveLength(limit);
      expect(totalDocs).toEqual(insertedUsers.length);
      expect(limit).toEqual(payload.limit);

      users.forEach(verifyUser);
    });
  });
});
