const AppException = require('./app.exception');

class ValidationException extends AppException {
  constructor(message, payload) {
    super(400, message, payload);
  }
}

module.exports = ValidationException;
