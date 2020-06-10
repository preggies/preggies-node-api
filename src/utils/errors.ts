export default class PreggiesError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  contentType: string;

  constructor(message, statusCode, status = 'fail') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = status;
    this.isOperational = true;
    this.contentType = 'application/json';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class AppError extends PreggiesError {}

export class DuplicateError extends PreggiesError {
  constructor(message = 'Duplicate Entry for unique field.', statusCode = 422, status = 'error') {
    super(message, statusCode, status);
  }
}

export class Mismatch extends PreggiesError {}

export class NotPersisted extends PreggiesError {
  constructor(message, statusCode = 422, status = 'error') {
    super(`${message} not created`, statusCode, status);
  }
}

export class NotFound extends PreggiesError {
  constructor(message = 'Not Found.') {
    super(message, 404, 'error');
  }
}

export class ServerError extends PreggiesError {
  constructor(message = 'Something else went wrong.', statusCode = 500, status = 'error') {
    super(message, statusCode, status);
  }
}
