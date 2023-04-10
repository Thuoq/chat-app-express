'use strict'
const HTTP_STATUS = require('./http-status')
class SuccessResponse {
  constructor({
    message,
    statusCode = HTTP_STATUS.OK.status,
    reasonStatusCode = HTTP_STATUS.OK.status,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.metadata = metadata
  }
  send(res, headers = {}) {
    res.set(headers)
    return res.status(this.status).json(this)
  }
}
class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      metadata,
    })
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = HTTP_STATUS.CREATED.status,
    reasonStatusCode = HTTP_STATUS.CREATED.reason,
  }) {
    super({
      message,
      metadata,
      statusCode,
      reasonStatusCode,
    })
  }
}

module.exports = {
  OK,
  CREATED,
}
