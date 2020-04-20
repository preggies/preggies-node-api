import jsonSchema from './json';
import { DuplicateError, ServerError, NotPersisted, NotFound } from '../utils/errors';

const create = async ({ db, payload, json }): Promise<string> => {
  let user;
  try {
    user = await db.users.create({ payload });
    if (!user) {
      throw new NotPersisted('User');
    }
  } catch (e) {
    if (e.name === 'MongoError' && /duplicate.*/i.test(e.message)) {
      throw new DuplicateError();
    } else if (e.name === 'MongoError' && /topology.*destroyed/i.test(e.message)) {
      throw new ServerError();
    } else {
      throw e;
    }
  }

  return json(jsonSchema)({ users: [user] });
};

const findById = async ({ db, payload, json }): Promise<string> => {
  const user = await db.users.findById({ payload });

  if (!user) {
    throw new NotFound();
  }

  return json(jsonSchema)({ users: [user] });
};

const findAll = async ({ db, payload, json }): Promise<string> => {
  const users = await db.users.findAll({ payload });

  if (!users || !users.length) {
    throw new NotFound();
  }

  return json(jsonSchema)({ users });
};

export default (db): object => ({
  create: async ({ payload, json }) =>
    create({
      db,
      payload,
      json,
    }),
  findById: async ({ payload, json }) =>
    findById({
      db,
      payload,
      json,
    }),
  findAll: async ({ payload, json }) =>
    findAll({
      db,
      payload,
      json,
    }),
});
