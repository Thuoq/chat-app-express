const HTTP_STATUS = require('./http-status')
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = HTTP_STATUS.CONFLICT.reason,
    statusCode = HTTP_STATUS.CONFLICT.status,
  ) {
    super(message, statusCode)
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = HTTP_STATUS.BAD_REQUEST.reason,
    statusCode = HTTP_STATUS.BAD_REQUEST.status,
  ) {
    super(message, statusCode)
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(
    message = HTTP_STATUS.AUTHORIZATION.reason,
    statusCode = HTTP_STATUS.AUTHORIZATION.status,
  ) {
    super(message, statusCode)
  }
}
class NotFoundError extends ErrorResponse {
  constructor(
    message = HTTP_STATUS.NOT_FOUND.reason,
    statusCode = HTTP_STATUS.NOT_FOUND.status,
  ) {
    super(message, statusCode)
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(
    message = HTTP_STATUS.FORBIDDEN.reason,
    statusCode = HTTP_STATUS.FORBIDDEN.status,
  ) {
    super(message, statusCode)
  }
}
module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
}
