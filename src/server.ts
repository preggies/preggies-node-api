import nanoexpress, { HttpResponse } from 'nanoexpress-pro/cjs';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { Mongoose } from 'mongoose';
import dbConnect, { schema } from './api/persistence/mongoose';

import globalErrorHandler from './api/controllers/errors';
import AppError from './utils/appError';
import './env';
import loadConfig from './config';

import services from './api/services';

// Initialize app
const app = nanoexpress();

const config = loadConfig('');

app.db = dbConnect(config);
app.schema = schema(app.db);
const serve = services(app.schema);

// Implement CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Logger
app.use(morgan('dev'));

// Services
app.use((req, _, next) => {
  req.locals.services = serve;
  next();
});

export type DbClient = Promise<Mongoose> | any;

// Routes

// Error handlers
app.setNotFoundHandler(
  (req, res): HttpResponse => {
    // If requested route doesnt exist return this
    return res.send(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  }
);

app.use(globalErrorHandler); // Express global error handler

// Terminate node if there is any uncaught exceptions
/* eslint-disable no-console */
process.on('uncaughtException', err => {
  console.log(err.name, err.message, err.stack);
  console.log('Uncaught Exception ❌❌❌');
  process.exit(1);
});

export default app;
