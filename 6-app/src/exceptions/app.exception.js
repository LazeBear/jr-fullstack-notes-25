class AppException extends Error {
  constructor(statusCode = 500, message, payload) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

module.exports = AppException;
