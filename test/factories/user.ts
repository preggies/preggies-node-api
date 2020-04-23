import { factory } from 'factory-girl';

import User from '../../src/persistence/mongoose/User/model';
import './meta';

export default factory.define('User', User, {
  fullname: 'Bolatan Ibrahim',
  email: factory.seq('User.email', n => `ehbraheem${n}@preggies.co`),
  dob: new Date('10-01-1960'),
  meta: factory.assocAttrs('Meta'),
});
