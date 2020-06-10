import { pickBy, path } from 'ramda';
import { intl, timezone } from '@ehbraheem/service-utils';
import { PaginateResult } from 'mongoose';
import User, { UserI } from './model';
import { QueryArgs, DbClient, Query } from '@ehbraheem/api';

const create = async ({ payload }: QueryArgs): Promise<UserI> => {
  const user = new User({
    ...payload,
    meta: { ...payload.meta, ...{ created: timezone.parse(Date.now(), intl.WAT) } },
  });

  return await (await user.save()).toObject();
};

const findById = async ({ payload }: QueryArgs): Promise<UserI> =>
  User.findById(payload.id).lean({ virtuals: true });

const findAll = async ({ payload }: QueryArgs): Promise<PaginateResult<UserI>> =>
  User.paginate(
    {
      ...pickBy(val => !!val, {
        role: path(['role'], payload),
        'meta.created': path(['from'], payload) && {
          $gte: path(['from'], payload),
          $lte: path(['to'], payload),
        },
      }),
    },
    {
      page: payload.page,
      limit: payload.limit,
      lean: true,
      leanWithId: true,
      sort: { 'meta.created': 'desc', 'meta.updated': 'desc' },
    }
  );

export default (client: DbClient): Query<UserI> => ({
  create: ({ payload, config }: QueryArgs): Promise<UserI> => create({ client, payload, config }),
  findById: ({ payload, config }: QueryArgs): Promise<UserI> =>
    findById({ client, payload, config }),
  findAll: async ({ payload, config }: QueryArgs): Promise<PaginateResult<UserI>> =>
    findAll({ client, payload, config }),
});
