import express, { Request, Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { Mongoose } from 'mongoose';
import https from 'https';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import dbConnect, { schema } from './api/persistence/mongoose';

import globalErrorHandler from './api/controllers/errors';
import AppError from './utils/appError';
import './env';
import loadConfig from './config';
import monitoring from './api/controllers/monitoring';

import services from './api/services';

export type DbClient = Promise<Mongoose>;

interface PreggiesApp extends Application {
  db?: DbClient;
  schema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface PreggiesRequest extends Request {
  services?: object;
}

const configFile = resolve(__dirname, `../config/${String(process.env.NODE_ENV)}.json`);
const config = loadConfig(configFile);

/* eslint-disable @typescript-eslint/camelcase */
const secure = config.get('server.secure') && {
  key: readFileSync(resolve(__dirname, config.get('server.tlsKey'))),
  cert: readFileSync(resolve(__dirname, config.get('server.tlsCert'))),
};

// Initialize app
const app: PreggiesApp = express();

app.db = dbConnect(config);
app.schema = schema(app.db);
const serve = services(app.schema);

app.use(cors());

app.use(helmet());

app.use(mongoSanitize());

app.use(xss());

app.use(morgan('dev'));

app.use((req: PreggiesRequest, _, next) => {
  req.services = serve;
  next();
});

app.use('/monitoring', monitoring);

// app.use();

export const PORT = config.get('server.port');

app.use(
  express.json({
    limit: '10kb',
  })
);

app.all('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

/* eslint-disable no-console */
process.on('uncaughtException', err => {
  console.log(err.name, err.message, err.stack);
  console.log('Uncaught Exception ❌❌❌');
  process.exit(1);
});

const server = https.createServer(
  {
    ...(secure || {}),
  },
  app
);

export default server;
