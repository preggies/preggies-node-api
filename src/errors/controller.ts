const sendErrorDev = (err, res): void => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res): void => {
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

export default (err, req, res): void => {
  console.log(process.env.NODE_ENV); // eslint-disable-line
  if (process.env.NODE_ENV === 'production') {
    // Configure other error types

    sendErrorProd(err, res);
  } else {
    sendErrorDev(err, res);
  }
};
