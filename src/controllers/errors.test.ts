import errors from './errors';
import AppError from '../utils/appError';

describe('Error Controller', () => {
  const err = new AppError('Error occured', 500);
  const res = {
    status: jest.fn().mockReturnValue({
      json: jest.fn(),
    }),
    send: jest.fn(),
  };

  it('Call res.status with error statusCode', () => {
    errors(err, undefined, res);

    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(err.statusCode);
  });
});
