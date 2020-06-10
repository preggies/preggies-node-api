import { factory } from 'factory-girl';

import User from '../../src/persistence/mongoose/User/model';
import './meta';
import { hash } from '@ehbraheem/service-utils';

export default factory.define(
  'User',
  User,
  {
    fullname: 'Bolatan Ibrahim',
    password: 'preggi1E$',
    email: factory.seq('User.email', n => `ehbraheem${n}@preggies.co`),
    dob: new Date('10-01-1960'),
    role: '5c3cab69ffb5bd22494a8484',
    meta: factory.assocAttrs('Meta'),
  },
  {
    afterBuild: async model => {
      model.password = await hash.generate(model.password, 12);
      return model;
    },
  }
);
