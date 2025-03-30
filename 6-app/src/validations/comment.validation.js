const Joi = require('joi');
const {
  objectIdValidationSchema,
  paginationValidationSchema,
} = require('./common.validation');

const baseValidationSchema = {
  content: Joi.string().max(1000),
  post: objectIdValidationSchema,
};

const commentValidationSchema = {
  create: Joi.object({
    content: baseValidationSchema.content.required(),
    post: baseValidationSchema.post.required(),
  }),
  update: Joi.object({
    content: baseValidationSchema.content.required(),
  }),
  getCommentsByPost: Joi.object({
    post: objectIdValidationSchema.required(),
    ...paginationValidationSchema,
  }),
};

module.exports = commentValidationSchema;
