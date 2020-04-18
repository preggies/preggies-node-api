import jsonSchema from './json';

const create = async ({ db, payload, json }): Promise<string> => {
  const user = await db.users.create({ payload });

  if (!user) {
    throw new Error('User not created');
  }

  return json(jsonSchema)({ users: [user] });
};

const findById = async ({ db, payload, json }): Promise<string> => {
  const user = await db.users.findById({ payload });

  if (!user) {
    throw Error(user);
  }

  return json(jsonSchema)({ users: [user] });
};

const findAll = async ({ db, payload, json }): Promise<string> => {
  const users = await db.users.findAll({ payload });

  if (!users) {
    throw Error(users);
  }

  if (!users.length) {
    throw Error('Could not find users');
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
