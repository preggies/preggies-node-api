import services from '../services';
import { NotFound } from '../utils/errors';
import { objectId } from '../utils/regex';

jest.mock('@ehbraheem/service-utils', () => ({
  __esModule: true,
  hash: {
    generate: jest.fn().mockReturnValue(true),
  },
}));

const user = {
  fullname: 'Bolatan Ibrahim',
  email: 'test@preggies.co',
  dob: '2020-04-18T12:16:43.636Z',
  id: '5c3cad20a5676122753b33ba',
};

const json = jest.fn().mockReturnValue(() => ({
  users: [user],
}));

const verify = (response): void => {
  Object.keys(user).forEach(k => {
    expect(response).toHaveProperty(k);
    expect(response[k]).toBeTruthy();
    expect(response[k]).toBe(user[k]);
  });
};

const db = {
  users: {
    findById: jest.fn().mockImplementation(
      ({ payload: { id } }) =>
        new Promise((resolve, reject) => {
          id && objectId.test(id) ? resolve(user) : reject(new NotFound());
        })
    ),
    create: jest.fn().mockImplementation(
      ({ payload: { fullname, email } }) =>
        new Promise((resolve, reject) => {
          fullname && email ? resolve(user) : reject(new Error('DB error.'));
        })
    ),
    findAll: jest.fn().mockResolvedValue({ docs: [user] }),
  },
};

describe('Services: Users', () => {
  describe('.create', () => {
    it('returns stringified format of newly created user', async () => {
      const { users } = services(db);

      const expected = await users.create({ payload: user, json });
      expect(expected).toHaveProperty('users');
      expect(expected['users']).toHaveLength(1);

      const { 0: returnedUser } = expected['users'];
      verify(returnedUser);
    });

    it('throws an error when new user creation fails', async () => {
      const { users } = services(db);

      await expect(users.create({ payload: {}, json })).rejects.toThrowError('DB error');
    });
  });

  describe('.findById', () => {
    it('returns stringified format of fetched user', async () => {
      const { users } = services(db);

      const expected = await users.findById({ payload: { id: user.id }, json });
      expect(expected).toHaveProperty('users');
      expect(expected['users']).toHaveLength(1);

      const { 0: returnedUser } = expected['users'];
      verify(returnedUser);
    });

    it('throws an error when user not found', async () => {
      const { users } = services(db);

      await expect(
        users.findById({ payload: { id: '5c3cad20a5676122753b33' }, json })
      ).rejects.toThrowError('Not Found.');
    });
  });

  describe('.findAll', () => {
    const payload = { limit: 10, page: 1, role: '5e594cf8a6d34546192af747' };

    it('returns stringified format of all users', async () => {
      const { users } = services(db);

      const expected = await users.findAll({ json, payload });
      expect(expected).toHaveProperty('users');
      expect(expected['users']).toHaveLength(1);

      const { 0: returnedUser } = expected['users'];
      verify(returnedUser);
    });

    it('throws an error when no user in DB', async () => {
      const db = {
        users: {
          findAll: jest.fn().mockResolvedValue({ docs: [] }),
        },
      };
      const { users } = services(db);

      await expect(users.findAll({ json, payload })).rejects.toThrowError('Not Found.');
    });
  });
});
