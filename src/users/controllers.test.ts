import { getUser, getAllUser, createUser, ROUTE_NAME } from './controllers';

const services = {
  users: {
    create: jest.fn().mockReturnValue('User entry created'),
    findById: jest.fn().mockReturnValue('User entry fetched'),
    findAll: jest.fn().mockReturnValue('User entries fetched'),
  },
};

const json = jest.fn();

const validator = jest.fn();

const res = {
  status: jest.fn(),
  end: jest.fn(),
};

res.status.mockImplementation(() => res);
res.end.mockImplementation(() => res);

jest.mock('./schema', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    validate: jest
      .fn()
      .mockImplementation(({ fullname, email }) =>
        fullname &&
        /[a-z0-9.]{5,}/i.test(fullname) &&
        email &&
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
          ? {}
          : { error: 'email or fullname is not permitted' }
      ),
  }),
}));

jest.mock('../utils/validators', () => ({
  __esModule: true,
  validateUUIDv4: jest.fn().mockReturnValue({
    validate: jest
      .fn()
      .mockImplementation(({ uuid }) =>
        uuid &&
        /\b(?=([0-9A-F]{8})\b)\1-(?=([0-9A-F]{4}))\2-(?=(4[0-9A-F]{3}))\3-(?=([89AB][0-9A-F]{3}))\4-(?=([0-9A-F]{12}))\5\b/i.test(
          uuid
        )
          ? {}
          : { error: 'not a valid user id' }
      ),
  }),
}));

const next = jest.fn();

describe(`Route. ${ROUTE_NAME}`, () => {
  describe(`POST /${ROUTE_NAME}`, () => {
    let handler;

    beforeEach(() => {
      handler = createUser({ services, json, validator });
    });

    it('returns response when given valid body', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test@preggies.co',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('User entry created');
    });

    it('return correct response for failed validation', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test#preggies.co',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"Invalid request"}');
    });

    it('call next middleware when user creation fail', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test#preggies.co',
        },
      };

      services.users.create.mockRejectedValue(new Error('User creation failed'));

      await handler(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new Error('User creation failed'));
    });
  });

  describe(`GET /${ROUTE_NAME}`, () => {
    let handler;

    beforeEach(() => {
      handler = getAllUser({ services, json });
    });
    const req = {};

    it('returns response when given valid body', async () => {
      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('User entry created');
    });

    it('call next middleware when user creation fail', async () => {
      services.users.findAll.mockRejectedValue(new Error('Users record fetch failed'));

      await handler(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new Error('Users record fetch failed'));
    });
  });

  describe(`GET /${ROUTE_NAME}/:uuid`, () => {
    let handler;

    beforeEach(() => {
      handler = getUser({ services, json, validator });
    });

    it('returns response when given valid body', async () => {
      const req = {
        params: {
          uuid: 'dfa7fd57-5d6b-4563-b60e-6c9f78f19579',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('User entry created');
    });

    it('return correct response for failed validation', async () => {
      const req = {
        params: {
          uuid: 'dfa7fd57-5d6b-4563-b60e-8f19579',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"Invalid request"}');
    });

    it('call next middleware when user creation fail', async () => {
      const req = {
        params: {
          uuid: 'dfa7fd57-5d6b-4563-b60e-6c9f78f19579',
        },
      };

      services.users.create.mockRejectedValue(new Error('User creation failed'));

      await handler(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new Error('User creation failed'));
    });
  });
});
