import users from './users/services';
import { Dict } from './utils/args';

export default (db): Dict => ({
  users: users(db),
});
