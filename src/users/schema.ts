import { ObjectSchema, Root } from 'joi';
import { metaRequestSchema } from '../utils/schemas';
import { password, objectId } from '../utils/regex';
import { paginationQueryValidator } from '../utils/validators';

export default (validator: Root): ObjectSchema =>
  validator.object().keys({
    fullname: validator
      .string()
      .max(70)
      .required(),
    email: validator
      .string()
      .email()
      .required(),
    password: validator
      .string()
      .regex(password)
      .required(),
    role: validator
      .string()
      .regex(objectId)
      .empty(''),
    dob: validator.date().iso(),
    meta: metaRequestSchema(validator),
  });

export const usersPagination = (validator: Root): ObjectSchema =>
  validator.object().keys({
    ...paginationQueryValidator(validator),
    role: validator
      .string()
      .regex(objectId)
      .empty(''),
  });
