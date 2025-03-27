const AppException = require('./app.exception');

class ConflictsException extends AppException {
  constructor(message, payload) {
    super(409, message, payload);
  }
}

module.exports = ConflictsException;
