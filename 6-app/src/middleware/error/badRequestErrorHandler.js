const ValidationException = require('../../exceptions/validation.exception');
const { logger } = require('../../utils/logger');

module.exports = (error, req, res, next) => {
  if (error instanceof ValidationException) {
    logger.info('Joi validation error', {
      payload: {
        type: 'Joi validation',
        path: req.path,
        method: req.method,
        error,
      },
    });

    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  if (error.name === 'ValidationError') {
    logger.warn('Mongoose validation error', {
      payload: {
        path: req.path,
        method: req.method,
        error,
      },
    });

    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
};
