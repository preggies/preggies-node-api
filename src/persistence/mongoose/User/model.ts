import mongoose, { Document, Schema } from 'mongoose';
import uuid from 'uuid';

interface MetaFields {
  active: boolean;
  updated?: Date;
  created?: Date;
}
interface UserFields {
  uuid?: string;
  fullname: string;
  email: string;
  dob: Date;
  meta: MetaFields;
}

export interface UserI extends UserFields, Document {}

export const MetaSchema: Schema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    updated: { type: Date },
    created: { type: Date },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  uuid: { type: String, default: uuid.v4 },
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date },
  meta: { type: MetaSchema },
});

type User = mongoose.Model<UserI>;

const User = mongoose.model<UserI>('Users', UserSchema);

export default User;
