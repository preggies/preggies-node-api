import services from './services';

const db = jest.fn();

describe('./services', () => {
  describe('.default', () => {
    it('should declare services', () => {
      expect(services(db)).toBeDefined();
    });
  });
});
