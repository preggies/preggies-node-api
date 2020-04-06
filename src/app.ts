import nanoexpress, { HttpResponse } from 'nanoexpress-pro/cjs';
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

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

// Routes

// Error handlers
app.setNotFoundHandler((req, res): HttpResponse => {
  // If requested route doesnt exist return this
return res.send(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler); // Express global error handler

module.exports = app;
