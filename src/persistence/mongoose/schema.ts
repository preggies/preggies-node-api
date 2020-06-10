import { Schema, SchemaOptions } from 'mongoose';

export interface Meta {
  active: boolean;
  updated?: Date;
  created?: Date;
}

export interface Persistable {
  meta: Meta;
}

export const MetaSchema: Schema = new Schema(
  {
    active: { type: Boolean, default: true },
    updated: { type: Date },
    created: { type: Date },
  },
  { _id: false }
);

export const DefaultSchemaOptions: SchemaOptions = {
  selectPopulatedPaths: false,
  bufferCommands: false,
  toObject: {
    getters: true,
    versionKey: false,
  },
};
