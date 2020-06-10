import { validateObjectId } from '../utils/validators';
import PreggiesError from '../utils/errors';
import schema, { usersPagination } from './schema';
import { Request, Response, NextFunction } from 'express';
import { prepareErrorResponse } from '../errors/controllers';

export const ROUTE_NAME = 'users';

export const get = ({
  services,
  json,
  validator,
}): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => async (
  req,
  res,
  next
) => {
  const { id } = req.params;

  const { error } = validateObjectId(validator).validate(id);

  if (error) {
    res.status(422).end('{"message":"Invalid request"}');
    return;
  }

  try {
    res.status(200).end(await services[ROUTE_NAME].findById({ payload: { id }, json }));
  } catch (e) {
    if (e instanceof PreggiesError) {
      res.status(e.statusCode).end(prepareErrorResponse(json, e));
    } else {
      next(e);
    }
  }
};

export const getAll = ({
  services,
  json,
  validator,
}): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { query: payload } = req;

  const { error } = usersPagination(validator).validate(payload);

  if (error) {
    res.status(422).end('{"message":"Invalid request"}');
    return;
  }

  try {
    res.status(200).end(await services[ROUTE_NAME].findAll({ json, payload }));
  } catch (e) {
    if (e instanceof PreggiesError) {
      res.status(e.statusCode).end(prepareErrorResponse(json, e));
    } else {
      next(e);
    }
  }
};

export default ({
  services,
  json,
  validator,
}): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body: payload } = req;

  const { error } = schema(validator).validate(payload);

  if (error) {
    res.status(422).end('{"message":"Invalid request"}');
    return;
  }

  try {
    res.status(201).end(await services[ROUTE_NAME].create({ payload, json }));
  } catch (e) {
    if (e instanceof PreggiesError) {
      res.status(e.statusCode).end(prepareErrorResponse(json, e));
    } else {
      next(e);
    }
  }
};
