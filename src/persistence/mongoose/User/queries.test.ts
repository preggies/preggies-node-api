import { factory } from 'factory-girl';

import '../../../../test/factories/user';
import queries from './queries';

import mongooseConnect from '../utils/';
import { dbConfig as config } from '../../../config';
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
        payload: { uuid: user.uuid },
      });

      expect(findUser).toBeDefined();
      verifyUser(findUser);

      verifyResponse(findUser, user);
    });

    it('should not find a user with an invalid uuid', async () => {
      const uuid = '02117187-a5d5-4681-b087-8b4b337d5b8d';
      const res = await userQueries.findById({ payload: { uuid: uuid } });
      expect(res).toBe(null);
    });
  });

  describe('findAll', () => {
    it('return all user in the DB', async () => {
      const insertedUsers = await factory.createMany('User', 5);
      const users = await userQueries.findAll();

      expect(users).toHaveLength(5);
      users.forEach(verifyUser);

      ['fullname', 'email', 'meta.active', 'uuid'].forEach(k => {
        expect(getFields(users, k)).containExactly(getFields(insertedUsers, k));
      });
    });

    it('returns null when no users in the db', async () => {
      const users = await userQueries.findAll();

      expect(users.length).toBeFalsy();
      expect(users).toHaveLength(0);
    });
  });
});
