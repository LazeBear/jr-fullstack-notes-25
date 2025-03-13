const NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${NODE_ENV}`,
});

const optionalConfigs = {
  PORT: process.env.PORT || 3000,
  NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  RATE_LIMIT_LIMIT: process.env.RATE_LIMIT_LIMIT || 100,
};

const requiredConfigs = {
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  JWT_KEY: process.env.JWT_KEY,
};

for (const key in requiredConfigs) {
  if (requiredConfigs[key] == null) {
    throw new Error(`Missing value for env var ${key}`);
  }
}

module.exports = {
  ...optionalConfigs,
  ...requiredConfigs,
};
