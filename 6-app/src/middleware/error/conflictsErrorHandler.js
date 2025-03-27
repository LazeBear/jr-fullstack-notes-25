const ConflictsException = require('../../exceptions/conflict.exception');
const { logger } = require('../../utils/logger');

module.exports = (error, req, res, next) => {
  if (error instanceof ConflictsException) {
    logger.info('Resource conflict', {
      payload: {
        method: req.method,
        path: req.path,
        message: error.message,
        ...error.payload,
      },
    });

    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
};
