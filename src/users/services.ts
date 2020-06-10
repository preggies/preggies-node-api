import jsonSchema from './json';
import { DuplicateError, ServerError, NotPersisted, NotFound } from '../utils/errors';
import { hash } from '@ehbraheem/service-utils';
import { Dict, Crud } from '@ehbraheem/api';
import { UserI } from '../persistence/mongoose/User/model';
import { PaginateResult } from 'mongoose';
import { responseDocumentSchema } from '../utils/schemas';

const create = async ({ db, payload, json }): Promise<string> => {
  let user;
  const hashedPassword = await hash.generate(payload.password, 12);
  try {
    user = await db.users.create({ payload: { ...payload, password: hashedPassword } });
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

  return json(responseDocumentSchema(jsonSchema))({ data: [user] });
};

const findById = async ({ db, payload, json }): Promise<string> => {
  const user = await db.users.findById({ payload });

  if (!user) {
    throw new NotFound();
  }

  return json(responseDocumentSchema(jsonSchema))({ data: [user] });
};

const findAll = async ({ db, payload, json }): Promise<string> => {
  const users = (await db.users.findAll({ payload })) as PaginateResult<UserI>;

  if (!users) {
    throw new NotFound();
  }

  if (!users.docs.length) {
    throw new NotFound();
  }

  const { docs } = users;

  return json(responseDocumentSchema(jsonSchema))({ data: docs });
};

export default (db: Dict): Crud<string> => ({
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
