import { PaginateModel, Document, Schema, SchemaOptions, model } from 'mongoose';
import leanVirtuals from 'mongoose-lean-virtuals';
import paginate from 'mongoose-paginate-v2';
import { Persistable, MetaSchema } from '../schema';

interface UserFields extends Persistable {
  fullname: string;
  email: string;
  dob: Date;
  password: string;
  role: string;
}

export interface UserI extends UserFields, Document {}

export const DefaultSchemaOptions: SchemaOptions = {
  selectPopulatedPaths: false,
  bufferCommands: false,
  toObject: {
    getters: true,
    versionKey: false,
  },
};

const UserSchema = new Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    dob: { type: Date },
    meta: { type: MetaSchema },
  },
  DefaultSchemaOptions
);

UserSchema.plugin(leanVirtuals);
UserSchema.plugin(paginate);

type User = PaginateModel<UserI>;

const User = model<UserI>('Users', UserSchema) as User;

export default User;
