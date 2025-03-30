const Joi = require('joi');
const mongoose = require('mongoose');

const paginationValidationSchema = {
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1),
};

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const objectIdValidationSchema = Joi.string()
  .custom(objectIdValidator, 'objectId validation')
  .messages({
    'any.invalid': '{{#label}} must a valid obejct id',
  });

module.exports = { paginationValidationSchema, objectIdValidationSchema };
