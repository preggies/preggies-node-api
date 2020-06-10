import routes from './routes';
import { Dict } from '@ehbraheem/api';
import { config, validator, json } from '../test/utils/controllerHelpers';
import { emptyFn } from '../test/utils/mock';

const services = emptyFn<Dict>();

describe('./routes', () => {
  describe('.default', () => {
    it('should declare routes', () => {
      expect(routes({ services, config, validator, json })).toBeDefined();
    });

    it('should return routes as object', () => {
      expect(routes({ services, config, validator, json })).toBeInstanceOf(Object);
    });
  });
});
