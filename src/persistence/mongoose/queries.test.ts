import queries from './queries';
import { DbClient } from '../../server';

describe('App Query', () => {
  it('Create a query object', () => {
    expect(typeof queries({} as DbClient)).toBe('object');
  });
});
