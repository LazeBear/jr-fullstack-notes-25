const morgan = require('morgan');
const config = require('../utils/config');
const { logger } = require('../utils/logger');

module.exports = morgan(
  config.NODE_ENV === 'development' ? 'dev' : 'combined',
  {
    stream: {
      write: (message) => logger.info(message),
    },
  }
);
