const jwt = require('jsonwebtoken');
const config = require('./config');

const secret = config.JWT_KEY;

const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

const validateToken = (token) => {
  // return jwt.verify(token, secret);
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
};

module.exports = {
  generateToken,
  validateToken,
};
