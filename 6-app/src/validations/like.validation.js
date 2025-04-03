const Joi = require('joi');
const { objectIdValidationSchema } = require('./common.validation');

const likeValidationSchema = {
  create: Joi.object({
    targetType: Joi.string().valid('Post', 'Comment').required(),
    targetId: objectIdValidationSchema.required(),
  }),
};

module.exports = likeValidationSchema;
