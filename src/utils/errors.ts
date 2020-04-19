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

export class DuplicateError extends PregiesError {}

export class Mismatch extends PregiesError {}

export class NotFound extends PregiesError {}

export class ServerError extends PregiesError {}
