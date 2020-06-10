import create, { get, getAll, ROUTE_NAME } from './controllers';
import { password, objectId, email as emailRE } from '../utils/regex';
import { next, validator, json, res } from '../../test/utils/controllerHelpers';

const services = {
  users: {
    create: jest.fn().mockReturnValue('User entry created'),
    findById: jest.fn().mockReturnValue('{"message":"User entry fetched"}'),
    findAll: jest.fn().mockReturnValue('{"message":"User entries fetched"}'),
  },
};

jest.mock('./schema', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    validate: jest
      .fn()
      .mockImplementation(({ fullname, email, password: pass, role }) =>
        pass &&
        password.test(pass) &&
        fullname &&
        /[a-z0-9.]{5,}/i.test(fullname) &&
        role &&
        objectId.test(role) &&
        email &&
        emailRE.test(email)
          ? {}
          : { error: 'email, password or fullname is not permitted' }
      ),
  }),
  usersPagination: jest.fn().mockReturnValue({
    validate: jest
      .fn()
      .mockImplementation(({ limit, role, page }) =>
        (!role || objectId.test(role)) && limit && /\d+/.test(limit) && page && /\d+/.test(page)
          ? {}
          : { error: 'limit, role or page is not permitted' }
      ),
  }),
}));

jest.mock('../utils/validators', () => ({
  __esModule: true,
  validateObjectId: jest.fn().mockReturnValue({
    validate: jest
      .fn()
      .mockImplementation(id => (id && objectId.test(id) ? {} : { error: 'not a valid user id' })),
  }),
}));

describe(`Route. ${ROUTE_NAME}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(`POST /${ROUTE_NAME}`, () => {
    let handler;

    beforeEach(() => {
      handler = create({ services, json, validator });
    });

    it('returns response when given valid body', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test@preggies.co',
          password: 'pr3GG1£s',
          role: '5e594cf8a6d34546192af747',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('User entry created');
    });

    it('return correct response for wrong email', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test#preggies.co',
          password: 'pr3GG1£s',
          role: '5e594cf8a6d34546192af747',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"Invalid request"}');
    });

    it('return correct response for failed password validation', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test#preggies.co',
          password: '3490k',
          role: '5e594cf8a6d34546192af747',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"Invalid request"}');
    });

    it('return correct response when password is not provided', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test#preggies.co',
          role: '5e594cf8a6d34546192af747',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"Invalid request"}');
    });

    it('return correct response for failed role validation', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test#preggies.co',
          password: 'pr3GG1£s',
          role: '5e594cf8a6d3454619747',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"Invalid request"}');
    });

    it('return correct response when role is not provided', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test#preggies.co',
          password: 'pr3GG1£s',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"Invalid request"}');
    });

    it('call next middleware when user creation fails', async () => {
      const req = {
        body: {
          fullname: 'Bolatan Ibrahim',
          email: 'test@preggies.co',
          password: 'pr3GG1£s',
          role: '5e594cf8a6d34546192af747',
        },
      };

      services.users.create.mockRejectedValue(new Error('{"message":"User creation failed"}'));

      await handler(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new Error('{"message":"User creation failed"}'));
    });
  });

  describe(`GET /${ROUTE_NAME}`, () => {
    let handler;

    beforeEach(() => {
      handler = getAll({ services, json, validator });
    });
    const req = { query: { limit: 10, page: 1, role: null } };

    it('returns response when given valid body', async () => {
      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"User entries fetched"}');
    });

    it('returns response when role is provided in query', async () => {
      const newReq = { query: { ...req.query, role: '5e594cf8a6d34546192af747' } };

      await handler(newReq, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"User entries fetched"}');
    });

    it('return correct response for failed validation', async () => {
      const newReq = { query: { ...req.query, role: '5e594cf8a6d34546192af7' } };

      await handler(newReq, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"Invalid request"}');
    });

    it('call next middleware when users records fetch fails', async () => {
      services.users.findAll.mockRejectedValue(
        new Error('{"message":"Users record fetch failed"}')
      );

      await handler(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new Error('{"message":"Users record fetch failed"}'));
    });
  });

  describe(`GET /${ROUTE_NAME}/:id`, () => {
    let handler;

    beforeEach(() => {
      handler = get({ services, json, validator });
    });

    it('returns response when given valid body', async () => {
      const req = {
        params: {
          id: '5e594cf8a6d34546192af747',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"User entry fetched"}');
    });

    it('return correct response for failed validation', async () => {
      const req = {
        params: {
          id: '5e594cf8a6d34546192af7',
        },
      };

      await handler(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.end).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalledWith('{"message":"Invalid request"}');
    });

    it('call next middleware when fetching user record fails', async () => {
      const req = {
        params: {
          id: '5e594cf8a6d34546192af747',
        },
      };

      services.users.findById.mockRejectedValue(
        new Error('{"message":"Users record fetch failed"}')
      );

      await handler(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new Error('{"message":"Users record fetch failed"}'));
    });
  });
});
