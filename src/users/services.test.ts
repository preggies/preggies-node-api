import services from '../services';

const user = {
  fullname: 'Bolatan Ibrahim',
  email: 'test@preggies.co',
  dob: '2020-04-18T12:16:43.636Z',
  uuid: 'd48501c0-e9bf-4f3c-8d32-5a58668ab1bc',
};

const json = jest.fn().mockReturnValue(() => ({
  users: [
    {
      fullname: 'Bolatan Ibrahim',
      email: 'test@preggies.co',
      dob: '2020-04-18T12:16:43.636Z',
      uuid: 'd48501c0-e9bf-4f3c-8d32-5a58668ab1bc',
    },
  ],
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
      ({ payload: { uuid } }) =>
        new Promise((resolve, reject) => {
          uuid &&
          /\b(?=([0-9A-F]{8})\b)\1-(?=([0-9A-F]{4}))\2-(?=(4[0-9A-F]{3}))\3-(?=([89AB][0-9A-F]{3}))\4-(?=([0-9A-F]{12}))\5\b/i.test(
            uuid
          )
            ? resolve(user)
            : reject(new Error('No matching document found.'));
        })
    ),
    create: jest.fn().mockImplementation(
      ({ payload: { fullname, email } }) =>
        new Promise((resolve, reject) => {
          fullname && email ? resolve(user) : reject(new Error('DB error.'));
        })
    ),
    findAll: jest.fn().mockResolvedValue([user]),
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

      const expected = await users.findById({ payload: { uuid: user.uuid }, json });
      expect(expected).toHaveProperty('users');
      expect(expected['users']).toHaveLength(1);

      const { 0: returnedUser } = expected['users'];
      verify(returnedUser);
    });

    it('throws an error when user not found', async () => {
      const { users } = services(db);

      await expect(
        users.findById({ payload: { uuid: 'bdhh-ggdcs-3432' }, json })
      ).rejects.toThrowError('No matching document found.');
    });
  });

  describe('.findAll', () => {
    it('returns stringified format of all users', async () => {
      const { users } = services(db);

      const expected = await users.findAll({ json });
      expect(expected).toHaveProperty('users');
      expect(expected['users']).toHaveLength(1);

      const { 0: returnedUser } = expected['users'];
      verify(returnedUser);
    });

    it('throws an error when no user in DB', async () => {
      const db = {
        users: {
          findAll: jest.fn().mockResolvedValue([]),
        },
      };
      const { users } = services(db);

      await expect(users.findAll({ json })).rejects.toThrowError('Could not find users');
    });
  });
});
