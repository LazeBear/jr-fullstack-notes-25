const Joi = require('joi');

const baseAuthSchema = {
  username: Joi.string().alphanum().min(2).max(20).required().messages({
    'string.min': 'Username must be at least 2 characters',
    'string.max': 'Username must be at least 20 characters',
    'string.alphanum': 'Username can only contain alphanumeric character',
  }),
  password: Joi.string().required().min(6).max(20),
};

const authValidationSchema = {
  register: Joi.object({
    ...baseAuthSchema,
    // xxxx
  }),
  login: Joi.object({
    ...baseAuthSchema,
    // xxxx
  }),
};
module.exports = authValidationSchema;
