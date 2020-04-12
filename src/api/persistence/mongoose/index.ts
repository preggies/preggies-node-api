import mongoose, { Mongoose } from 'mongoose';
import { Config } from 'convict';

import connect from './connect';
import queries from './queries';
import { DbClient } from '../../../server';

export const schema = (client: DbClient): any => queries(client); // eslint-disable-line @typescript-eslint/no-explicit-any

export const close = (mongo: Mongoose): Promise<void> => mongo.disconnect();

mongoose.set('useCreateIndex', true);
mongoose.set('bufferCommands', false);

export default async (config: Config<object>): Promise<Mongoose> => connect(mongoose, config);
