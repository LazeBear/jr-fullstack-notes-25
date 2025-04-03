const Joi = require('joi');
const { paginationValidationSchema } = require('./common.validation');

const hashtagValidationSchema = {
  popular: Joi.object({
    ...paginationValidationSchema,
  }),
};
module.exports = hashtagValidationSchema;
