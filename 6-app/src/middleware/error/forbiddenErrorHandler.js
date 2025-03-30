const ForbiddenException = require('../../exceptions/forbidden.exception');
const { logger } = require('../../utils/logger');

module.exports = (error, req, res, next) => {
  if (error instanceof ForbiddenException) {
    logger.info('Unauthorized access', {
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
