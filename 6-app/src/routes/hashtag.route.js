// GET /hashtags?type=popular/trending
// GET /hashtags/popluar

const { Router } = require('express');
const { getPopularHashtags } = require('../controllers/hashtag.controller');
const { validateQuery } = require('../middleware/validation.middleware');
const hashtagValidationSchema = require('../validations/hashtag.validation');

const hashtagRouter = new Router();

hashtagRouter.get(
  '/popular',
  validateQuery(hashtagValidationSchema.popular),
  getPopularHashtags
);

module.exports = hashtagRouter;
