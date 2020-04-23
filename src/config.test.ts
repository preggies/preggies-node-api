import loadConfig, { dbConfig, conf } from './config';

describe('Config', () => {
  describe('loadConfig', () => {
    const config = loadConfig('');
    it('should declare config', () => {
      expect(config).toBeDefined();
    });

    it('should have expected configurations', () => {
      expect(config.get('swagger.title')).toBeDefined();
      expect(config.get('server.hostname')).toBeDefined();
    });

    it('expose Convict-like API', () => {
      expect(config.get).toBeInstanceOf(Function);
      expect(config.set).toBeInstanceOf(Function);
      expect(config.has).toBeInstanceOf(Function);
      expect(config.get('server.hostname')).toBe('127.0.0.1');
      expect(config.get('mongo.database')).toBeTruthy();
    });
  });

  describe('dbConfig', () => {
    const config = dbConfig;
    it('should declare config', () => {
      expect(config).toBeDefined();
    });

    it('should have expected configurations', () => {
      expect(config.get('mongo.host')).toBeDefined();
      expect(config.get('mongo.database')).toBeDefined();
    });

    it('expose Convict-like API', () => {
      expect(config.get).toBeInstanceOf(Function);
      expect(config.set).toBeInstanceOf(Function);
      expect(config.has).toBeInstanceOf(Function);
      expect(config.get('mongo.host')).toBe('mongodb://127.0.0.1:27017');
      expect(config.get('mongo.database')).toBeTruthy();
    });
  });

  describe('conf', () => {
    it('should declare config', () => {
      expect(conf).toBeDefined();
    });

    it('should have expected configurations', () => {
      expect(conf['mongo']['host']).toBeDefined();
      expect(conf['mongo'].database).toBeDefined();
    });
  });
});
