const Joi = require('joi');
const { paginationValidationSchema } = require('./common.validation');

const baseValidationSchema = {
  title: Joi.string().trim().min(3).max(100),
  content: Joi.string().trim().min(3).max(1000),
};

const postValidateSchema = {
  search: Joi.object({
    q: Joi.string().trim().min(1).max(100),
    ...paginationValidationSchema,
  }),
  create: Joi.object({
    title: baseValidationSchema.title.required(),
    content: baseValidationSchema.content.required(),
  }),
  update: Joi.object({
    ...baseValidationSchema,
  }),
};

module.exports = postValidateSchema;
