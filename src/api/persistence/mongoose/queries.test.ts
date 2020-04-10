import queries from './queries';

describe('App Query', () => {
  it('Create a query object', () => {
    expect(typeof queries({})).toBe('object');
  });
});
