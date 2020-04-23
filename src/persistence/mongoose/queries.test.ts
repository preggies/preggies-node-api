import queries from './queries';
import { DbClient } from '../../utils/args';

describe('App Query', () => {
  it('Create a query object', () => {
    expect(typeof queries({} as DbClient)).toBe('object');
  });
});
