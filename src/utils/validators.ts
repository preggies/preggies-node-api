import { Joi } from '@hapi/joi';
import { StringSchema } from 'joi';

export const validateUUIDv4 = (validator: Joi): StringSchema =>
  validator.string().guid({
    version: ['uuidv4'],
  });
