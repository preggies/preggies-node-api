import { validateUUIDv4 } from '../utils/validators';
import schema from './schema';
import { Request, Response, NextFunction } from 'express';

export const ROUTE_NAME = 'users';

export const getUser = ({
  services,
  json,
  validator,
}): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => async (
  req,
  res,
  next
) => {
  const { uuid } = req.params;

  const { error } = validateUUIDv4(validator).validate(uuid);

  if (error) {
    res.status(422).end('{"message":"Invalid request"}');
  }

  try {
    res.status(200).end(await services[ROUTE_NAME].findById({ payload: { uuid }, json }));
  } catch (e) {
    if (e.name === 'NotFound') {
      res.status(e.statusCode).end(e.message);
    } else {
      next(e);
    }
  }
};

export const getAllUser = ({
  services,
  json,
}): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).end(await services[ROUTE_NAME].findAll({ json }));
  } catch (e) {
    if (e.name === 'NotFound') {
      res.status(e.statusCode).end(e.message);
    } else {
      next(e);
    }
  }
};

export const createUser = ({
  services,
  json,
  validator,
}): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => async (
  req,
  res,
  next
) => {
  const { body: payload } = req;

  const { error } = schema(validator).validate(payload);

  if (error) {
    res.status(422).end('{"message":"Invalid request"}');
  }

  try {
    res.status(201).end(await services[ROUTE_NAME].create({ payload, json }));
  } catch (e) {
    if (e.name === 'ServerError') {
      res.status(e.statusCode).end(e.message);
    } else if (e.name === 'DuplicateError') {
      res.status(e.statusCode).end(e.message);
    } else if (e.name === 'NotPersisted') {
      res.status(e.statusCode).end(e.message);
    } else {
      next(e);
    }
  }
};
