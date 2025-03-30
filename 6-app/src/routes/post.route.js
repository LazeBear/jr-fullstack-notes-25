const { Router } = require('express');
const {
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  createPost,
} = require('../controllers/post.controller');
const postValidateSchema = require('../validations/post.validation');
const {
  validateQuery,
  validateBody,
  validateObjectId,
} = require('../middleware/validation.middleware');

const postRouter = Router();

postRouter.get('/', validateQuery(postValidateSchema.search), getAllPosts);
postRouter.get('/:id', validateObjectId('id'), getPostById);
postRouter.put(
  '/:id',
  validateObjectId('id'),
  validateBody(postValidateSchema.update),
  updatePostById
);
postRouter.delete('/:id', validateObjectId('id'), deletePostById);
postRouter.post('/', validateBody(postValidateSchema.create), createPost);

module.exports = postRouter;
