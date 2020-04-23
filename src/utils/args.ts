import { Config } from 'convict';
import Joi from '@hapi/joi';
import { Mongoose } from 'mongoose';

export type DbClient = Promise<Mongoose>;

export type Dict = { [k: string]: Crud<any> }; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Schema = (client: DbClient) => Dict;

interface Args {
  payload?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  config?: Config<object>;
}

interface CrudArgs extends Args {
  db?: Dict;
  client?: DbClient;
  json?: Function;
}

export interface Crud<T> {
  create?(CrudArgs): Promise<T>;
  findAll?(CrudArgs): Promise<object | T[]>;
  findById?(CrudArgs): Promise<T>;
  removeById?(CrudApiArgs): Promise<void>;
  updateById?(CrudApiArgs): Promise<object>;
}

interface LoggableArgs extends Args {
  uuid?: Function;
  json?: Function;
  log?: Function;
}

export interface ServiceArgs extends LoggableArgs {
  db: Dict;
}

export interface RouteArgs extends LoggableArgs {
  services?: Dict;
  validator?: Joi;
}

export interface QueryArgs extends Args {
  client: DbClient;
}
