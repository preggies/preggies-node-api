import users from './users/services';
import { Dict } from '@ehbraheem/api';

export default (db): Dict => ({
  users: users(db),
});
