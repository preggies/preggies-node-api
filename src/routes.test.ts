import routes from './routes';

const config = jest.fn();
const services = jest.fn();
const validator = jest.fn();
const json = jest.fn();

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
