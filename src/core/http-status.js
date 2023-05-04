const HTTP_STATUS = {
  FORBIDDEN: {
    status: 403,
    reason: 'Bad request error',
  },
  CONFLICT: {
    status: 409,
    reason: 'Conflict error',
  },
  BAD_REQUEST: {
    status: 400,
    reason: 'Bad Request',
  },
  OK: {
    status: 200,
    reason: 'Success',
  },
  CREATED: {
    status: 201,
    reason: 'Created',
  },
  AUTHORIZATION: {
    status: 401,
    reason: 'Auth failure',
  },
  NOT_FOUND: {
    status: 400,
    reason: 'Not found !',
  },
  INTERNAL_SERVER: {
    status: 500,
    reason: 'Internal server!',
  },
}

module.exports = HTTP_STATUS
