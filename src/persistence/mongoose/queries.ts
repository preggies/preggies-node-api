import { DbClient, Dict } from '@ehbraheem/api';

import users from './User/queries';

export default (client: DbClient): Dict => ({
  users: users(client),
});
