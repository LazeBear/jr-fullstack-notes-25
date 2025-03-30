const NotFoundException = require('../../exceptions/notFound.exception');
const { logger } = require('../../utils/logger');

module.exports = (error, req, res, next) => {
  if (error instanceof NotFoundException) {
    logger.info('Resource not found', {
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
