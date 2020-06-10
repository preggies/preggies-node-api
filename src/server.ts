import { readFileSync } from 'fs';
import { resolve } from 'path';
import server, { mongooseConnect as dbConnect, Api, ApiRequest, ApiJson } from '@ehbraheem/api';
import schema from './persistence/mongoose/queries';
import loadConfig from './config';
import './env';

import services from './services';
import routes from './routes';
import errorHandler from './errors/controllers';

type PreggiesApp = Api;

export type PreggiesRequest = ApiRequest;

export type PreggiesJson = ApiJson;

const configFile = resolve(__dirname, `../config/${String(process.env.NODE_ENV)}.json`);
const config = loadConfig(configFile);
/* eslint-disable @typescript-eslint/camelcase */
export const secure = config.get('server.secure') && {
  key: readFileSync(resolve(__dirname, config.get('server.tlsKey'))),
  cert: readFileSync(resolve(__dirname, config.get('server.tlsCert'))),
};

export const PORT = config.get('server.port');

export default async (): Promise<PreggiesApp> => {
  const app = server({
    routes,
    dbConnect,
    config,
    schema,
    services,
    errorHandler,
  });

  return app;
};
