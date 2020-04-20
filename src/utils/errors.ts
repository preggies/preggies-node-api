class PregiesError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message, statusCode, status = 'fail') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = status;
    this.isOperational = true;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default class AppError extends PregiesError {}

export class DuplicateError extends PregiesError {
  constructor(
    message = '{"error":"Duplicate Entry for unique field."}',
    statusCode = 422,
    status = 'error'
  ) {
    super(message, statusCode, status);
  }
}

export class Mismatch extends PregiesError {}

export class NotPersisted extends PregiesError {
  constructor(message, statusCode = 422, status = 'error') {
    super(`{"error":"${message} not created."}`, statusCode, status);
  }
}

export class NotFound extends PregiesError {
  constructor(message = '{"error":"Not Found."}', statusCode = 404, status = 'error') {
    super(message, statusCode, status);
  }
}

export class ServerError extends PregiesError {
  constructor(
    message = '{"error":"Something else went wrong."}',
    statusCode = 500,
    status = 'error'
  ) {
    super(message, statusCode, status);
  }
}
