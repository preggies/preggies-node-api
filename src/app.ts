import nanoexpress, { HttpResponse } from 'nanoexpress-pro/cjs';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

import globalErrorHandler from './api/controllers/errors';
import AppError from './utils/appError';

import services from './api/services';

// Initialize app
const app = nanoexpress();

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
  req.locals.services = services(app.get('db'));
  next();
});

// Routes

// Error handlers
app.setNotFoundHandler(
  (req, res): HttpResponse => {
    // If requested route doesnt exist return this
    return res.send(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  }
);

app.use(globalErrorHandler); // Express global error handler

export default app;
