// Error response in development environment

import AppError from 'src/utils/appError';

const sendErrorDev = (err: AppError, res): void => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Error response in production environment
const sendErrorProd = (err: AppError, res): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

export default (err: AppError, req, res): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    // Configure other error types

    sendErrorProd(err, res);
  } else {
    sendErrorDev(err, res);
  }
};