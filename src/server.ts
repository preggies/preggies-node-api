import express, { Request, Application, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import Joi from '@hapi/joi';
import json from 'fast-json-stringify';
// import swaggerUi from 'swagger-ui-express';

// import swaggerDocument from './swagger';
import dbConnect, { schema } from './persistence/mongoose/utils';

import globalErrorHandler from './controllers/errors';
import AppError from './utils/errors';
import './env';
import loadConfig from './config';

import services from './services';
import routes from './route';
import { DbClient, Dict } from './utils/args';

interface PreggiesApp extends Application {
  db?: DbClient;
  schema?: Dict;
}

interface PreggiesRequest extends Request {
  services?: object;
}

const configFile = resolve(__dirname, `../config/${String(process.env.NODE_ENV)}.json`);
const config = loadConfig(configFile);

/* eslint-disable @typescript-eslint/camelcase */
export const secure = config.get('server.secure') && {
  key: readFileSync(resolve(__dirname, config.get('server.tlsKey'))),
  cert: readFileSync(resolve(__dirname, config.get('server.tlsCert'))),
};

// Initialize app
const app: PreggiesApp = express();
app.db = dbConnect(config);
app.schema = schema(app.db);
const serve = services(app.schema);

const validator = Joi;

app.use(cors());

app.use(helmet());

app.use(mongoSanitize());

app.use(xss());

app.use(morgan('dev'));

app.use(express.json());

app.use((_, res: Response, next: NextFunction) => {
  res.contentType('application/json');
  next();
});

const availableRoutes = routes({ services: serve, config, validator, json });
Object.keys(availableRoutes).forEach(path => {
  app.use(path, availableRoutes[path]);
});

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument(config)));

app.use((req: PreggiesRequest, _, next) => {
  req.services = serve;
  next();
});

export const PORT = config.get('server.port');

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

export default app;
