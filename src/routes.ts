import { Router } from 'express';

import monitoringRoute, { MOUNT_POINT as monitoring } from './monitoring/routes';
import usersRoutes, { MOUNT_POINT as users } from './users/routes';

export default ({ services, config, validator, json }): object => ({
  [users]: usersRoutes({ router: Router(), services, validator, json }),
  [monitoring]: monitoringRoute({ router: Router() }),
});

export const callbackify = (fn): Function =>
  Object.defineProperty((...args) => fn(...args.slice(0, -1)).catch(args.pop()), 'length', {
    value: fn.length + 1,
    configurable: true,
  });
