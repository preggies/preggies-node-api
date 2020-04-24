import { getUser, getAllUser, createUser, ROUTE_NAME } from './controllers';
import { Router } from 'express';

export const MOUNT_POINT = `/${ROUTE_NAME}`;

export default ({ router, services, validator, json }): Router => {
  router.route('/:uuid').get(getUser({ services, json, validator }));

  router
    .route('/')
    .get(getAllUser({ services, json }))
    .post(createUser({ services, json, validator }));

  return router;
};
