import create, { get as getUser, getAll, ROUTE_NAME } from './controllers';
import { Router } from 'express';
import { RouteArgs } from '@ehbraheem/api';

export const MOUNT_POINT = `/${ROUTE_NAME}`;

export default ({ router, services, validator, json }: RouteArgs): Router => {
  router.route('/:id').get(getUser({ services, json, validator }));

  router
    .route('/')
    .get(getAll({ services, json, validator }))
    .post(create({ services, json, validator }));

  return router;
};
