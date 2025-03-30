const ValidationException = require('../exceptions/validation.exception');
const mongoose = require('mongoose');

const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const value = await schema.validateAsync(req.body, {
        stripUnknown: true,
        allowUnknown: true,
      });
      req.body = value;
      next();
    } catch (e) {
      next(new ValidationException(e.details[0].message, e));
    }
  };
};

const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      const value = await schema.validateAsync(req.query, {
        stripUnknown: true,
        allowUnknown: true,
      });
      req.query = value;
      next();
    } catch (e) {
      next(new ValidationException(e.details[0].message, e));
    }
  };
};

// /posts/:id key -> id
// /posts/:postId key -> postId
const validateObjectId = (key) => {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[key])) {
      throw new ValidationException(`${key} is not a valid ObjectId`);
    }
    next();
  };
};

module.exports = {
  validateBody,
  validateQuery,
  validateObjectId,
};
