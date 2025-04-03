const { logger } = require('../../utils/logger');

module.exports = (error, req, res, next) => {
  console.log(error);
  logger.error('Unexpected error occured', {
    payload: {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
    },
  });

  res.status(500).json({
    success: false,
    error: 'Something went wrong',
  });
};
