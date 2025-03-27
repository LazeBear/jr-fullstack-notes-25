const ValidationException = require('../exceptions/validation.exception');

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

module.exports = {
  validateBody,
};
