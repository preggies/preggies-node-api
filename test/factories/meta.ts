import { factory } from 'factory-girl';

import { MetaSchema } from '../../src/persistence/mongoose/schema';

export default factory.define('Meta', MetaSchema, {
  active: true,
});
