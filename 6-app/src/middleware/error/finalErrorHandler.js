const { logger } = require('../../utils/logger');

module.exports = (error, req, res, next) => {
  logger.error('Unexpected error occured', {
    payload: {
      error,
      path: req.path,
      method: req.method,
    },
  });

  res.status(500).json({
    success: false,
    error: 'Something went wrong',
  });
};
