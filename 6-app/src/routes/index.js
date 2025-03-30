const { Router } = require('express');
const authRouter = require('./auth.route');
const {
  public,
  private,
  adminPath,
} = require('../controllers/test.controller');
const authGuardMiddleware = require('../middleware/authGuard.middleware');
const roleGuardMiddleware = require('../middleware/roleGuard.middleware');
const postRouter = require('./post.route');
const commentRouter = require('./comment.route');

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/posts', authGuardMiddleware, postRouter);
v1Router.use('/comments', commentRouter);

v1Router.get('/public', public);
v1Router.get('/private', authGuardMiddleware, private);
v1Router.get(
  '/admin',
  authGuardMiddleware,
  roleGuardMiddleware('admin'),
  adminPath
);

module.exports = v1Router;
