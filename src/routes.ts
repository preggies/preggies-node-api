import { Router } from 'express';
import { RouterArgs, ApiRouter } from '@ehbraheem/api';

import usersRoutes, { MOUNT_POINT as users } from './users/routes';

export default ({ services, config, validator, json }: RouterArgs): ApiRouter => ({
  [users]: usersRoutes({ router: Router(), services, validator, json, config }),
});
