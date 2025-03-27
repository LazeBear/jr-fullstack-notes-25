const AppException = require('./app.exception');

class UnauthorizedException extends AppException {
  constructor(message, payload) {
    super(401, message, payload);
  }
}

module.exports = UnauthorizedException;
