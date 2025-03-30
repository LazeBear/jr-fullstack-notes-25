const badRequestErrorHandler = require('./badRequestErrorHandler');
const conflictsErrorHandler = require('./conflictsErrorHandler');
const finalErrorHandler = require('./finalErrorHandler');
const forbiddenErrorHandler = require('./forbiddenErrorHandler');
const notFoundErrorHandler = require('./notFoundErrorHandler');
const unauthorizedErrorHandler = require('./unauthorizedErrorHandler');

const errorMiddleware = [
  badRequestErrorHandler, //
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  notFoundErrorHandler,
  conflictsErrorHandler,
  finalErrorHandler,
];

module.exports = errorMiddleware;
