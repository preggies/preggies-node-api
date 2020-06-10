import { StringSchema, Root } from 'joi';
import { objectId } from './regex';

export const validateUUIDv4 = (validator: Root): StringSchema =>
  validator.string().guid({
    version: ['uuidv4'],
  });

export const validateObjectId = (validator: Root): StringSchema =>
  validator.string().regex(objectId);

export const paginationQueryValidator = (validator: Root): object => ({
  page: validator
    .number()
    .min(1)
    .max(100),
  limit: validator
    .number()
    .min(1)
    .max(1000),
  to: validator.date().iso(),
  from: validator.date().iso(),
});
