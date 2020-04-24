import { DbClient, Dict } from '../../utils/args';

import users from './User/queries';

export default (client: DbClient): Dict => ({
  users: users(client),
});
