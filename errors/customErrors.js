const { StatusCodes } = require("http-status-codes");

class BadRequest extends Error {
  constructor(Message) {
    super(Message);
    this.statusCode = 400;
  }
}

class NotFound extends Error {
  constructor(Message) {
    super(Message);
    this.statusCode = StatusCodes.NOT_FOUND;
    // this.Message = Message;
  }
}

class Unauthenticated extends Error {
  constructor(Message) {
    super(Message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
class InternalServerError extends Error {
  constructor(Message) {
    super(Message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = { BadRequest, Unauthenticated, NotFound, InternalServerError };
