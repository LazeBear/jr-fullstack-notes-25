const badRequestErrorHandler = require('./badRequestErrorHandler');
const conflictsErrorHandler = require('./conflictsErrorHandler');
const finalErrorHandler = require('./finalErrorHandler');
const unauthorizedErrorHandler = require('./unauthorizedErrorHandler');

const errorMiddleware = [
  badRequestErrorHandler, //
  unauthorizedErrorHandler,
  conflictsErrorHandler,
  finalErrorHandler,
];

module.exports = errorMiddleware;
