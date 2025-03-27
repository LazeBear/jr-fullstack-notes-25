const UnauthorizedException = require('../../exceptions/unauthorized.exception');
const { logger } = require('../../utils/logger');

module.exports = (error, req, res, next) => {
  if (error instanceof UnauthorizedException) {
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
