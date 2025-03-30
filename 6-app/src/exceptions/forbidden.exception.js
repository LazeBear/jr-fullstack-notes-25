const AppException = require('./app.exception');

class ForbiddenException extends AppException {
  constructor(message, payload) {
    super(403, message, payload);
  }
}

module.exports = ForbiddenException;
