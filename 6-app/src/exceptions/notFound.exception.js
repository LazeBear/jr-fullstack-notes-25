const AppException = require('./app.exception');

class NotFoundException extends AppException {
  constructor(message, payload) {
    super(404, message, payload);
  }
}

module.exports = NotFoundException;
