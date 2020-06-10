import errors from './controllers';
import { AppError } from '../utils/errors';
import { res, next } from '../../test/utils/controllerHelpers';
import { emptyFn } from '../../test/utils/mock';
import { PreggiesRequest } from '../server';

describe('Error Controller', () => {
  const err = new AppError('Error occured', 500, 'error');
  const req = emptyFn<PreggiesRequest>();
  req.json = jest.fn().mockReturnValue(val => val);

  it('Call res.status with error statusCode', () => {
    errors(err, req, res, next);

    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(err.statusCode);
  });
});
