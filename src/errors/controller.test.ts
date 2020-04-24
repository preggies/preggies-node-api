import errors from './controller';
import AppError from '../utils/errors';

describe('Error Controller', () => {
  const err = new AppError('Error occured', 500, 'error');
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
