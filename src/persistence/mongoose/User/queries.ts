import User, { UserI } from './model';
import { QueryArgs, DbClient } from '../../../utils/args';

const create = async ({ payload }: QueryArgs): Promise<UserI> => {
  const user = new User({
    ...payload,
    meta: { ...payload.meta, ...{ created: new Date() } },
  });

  return await user.save();
};

const findById = async ({ payload }: QueryArgs): Promise<UserI> =>
  User.findOne({ uuid: payload.uuid });

const findAll = async (): Promise<object> => User.find().lean();

export default (client: DbClient): object => ({
  create: ({ payload, config }: QueryArgs) => create({ client, payload, config }),
  findById: ({ payload, config }: QueryArgs) => findById({ client, payload, config }),
  findAll: () => findAll(),
});
