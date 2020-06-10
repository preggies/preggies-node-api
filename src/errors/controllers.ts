import PreggiesError from '../utils/errors';
import { Response, NextFunction } from 'express';
import { responseDocumentSchema } from '../utils/schemas';
import { PreggiesRequest, PreggiesJson } from '../server';

export const prepareErrorResponse = (
  json: PreggiesJson,
  err: PreggiesError,
  customMsg?: string
): string => {
  const prod = process.env.NODE_ENV === 'production';

  return json(responseDocumentSchema({ title: 'Error occured.' }))({
    error: {
      status: err.status || 'error',
      message:
        customMsg || (prod && !err.isOperational ? 'Something went very wrong' : err.message),
      [!prod && 'error']: err.toString(),
      [!prod && 'stack']: err.stack,
      code: err.statusCode || 500,
    },
  });
};

export default (
  err: PreggiesError,
  req: PreggiesRequest,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  const { json } = req;
  res.contentType(err.contentType || 'application/json');

  // Configure other error options

  res.status(err.statusCode || 500).end(prepareErrorResponse(json, err));
};
