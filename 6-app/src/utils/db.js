const mongoose = require('mongoose');
const config = require('./config');
const { logger } = require('./logger');

const connectToDb = async () => {
  const db = mongoose.connection;

  db.on('connecting', () => {
    logger.info('Attempting to connect to DB');
  });

  db.on('connected', () => {
    logger.info('DB connected successfully');
  });

  db.on('error', (error) => {
    logger.error('DB connection error', { payload: error });
    process.exit(1);
    // 0 -> normal exit
    // 0+, 1,2 -> error exit
  });

  db.on('disconnected', () => {
    logger.warn('DB connection disconnected');
  });

  db.on('reconnected', () => {
    logger.info('DB connection reconnected');
  });

  return mongoose.connect(config.DB_CONNECTION_STRING);
};

module.exports = connectToDb;
