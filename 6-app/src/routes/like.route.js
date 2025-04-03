const { Router } = require('express');
const likeValidationSchema = require('../validations/like.validation');
const {
  validateBody,
  validateObjectId,
} = require('../middleware/validation.middleware');
const {
  createLike,
  deleteLikeById,
} = require('../controllers/like.controller');

const likeRouter = Router();

likeRouter.post('/', validateBody(likeValidationSchema.create), createLike);
likeRouter.delete('/:id', validateObjectId('id'), deleteLikeById);

module.exports = likeRouter;
