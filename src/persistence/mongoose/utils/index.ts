import mongoose, { Mongoose } from 'mongoose';
import { Config } from 'convict';

import connect from './connect';
import queries from '../queries';
import { DbClient, Dict } from '../../../utils/args';

export const schema = (client: DbClient): Dict => queries(client); // eslint-disable-line @typescript-eslint/no-explicit-any

export const close = (mongo: Mongoose): Promise<void> => mongo.disconnect();

mongoose.set('useCreateIndex', true);
mongoose.set('bufferCommands', false);

export default (config: Config<object>): Promise<Mongoose> => connect(mongoose, config);
