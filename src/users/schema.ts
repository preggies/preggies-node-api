import { ObjectSchema } from 'joi';
import { makeMetaRequestPayloadSchema } from '../utils/schemas';

export default (validator): ObjectSchema =>
  validator.object().keys({
    fullname: validator.string().max(70),
    email: validator.string().email(),
    password: validator.string().regex(/\w{6,}/),
    age: validator.number().min(1),
    dob: validator.date().iso(),
    meta: makeMetaRequestPayloadSchema(validator),
  });
