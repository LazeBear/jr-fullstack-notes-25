const CommentModel = require('../models/comment.model');
const PostModel = require('../models/post.model');

// startSession() -> session, session.withTransaction(xxxx)

// POST /posts/:postId/comments
// POST /comments/:id {postId}
const createComment = async (req, res, next) => {
  try {
    const { content, post: postId } = req.body;

    await PostModel.findByIdOrFail(postId);
    // await CommentModel.create()
    const comment = new CommentModel({
      content,
      post: postId, // post._id
      user: req.user.id,
    });
    await comment.save();

    // post.commentsCount++;
    // await post.save();
    await PostModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (e) {
    next(e);
  }
};

const getCommentsByPostId = async (req, res, next) => {
  try {
    const { post: postId, page, limit } = req.query;

    await PostModel.findByIdOrFail(postId);
    const comments = await CommentModel.find({ post: postId })
      .populate('user', 'username')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    res.json({
      success: true,
      data: comments,
    });
  } catch (e) {
    next(e);
  }
};

const updateCommentById = async (req, res, next) => {
  try {
    const comment = await CommentModel.findByIdOrFail(req.params.id);
    checkUserOwnsComment(comment, req.user.id);
    comment.set(req.body);
    await comment.save();
    res.json({
      success: true,
      data: comment,
    });
  } catch (e) {
    next(e);
  }
};

const deleteCommentById = async (req, res, next) => {
  try {
    const comment = await CommentModel.findByIdOrFail(req.params.id);
    checkUserOwnsComment(comment, req.user.id);
    await comment.deleteOne();
    // TODO: update commentsCount
    await PostModel.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

const checkUserOwnsComment = (comment, userId) => {
  if (comment.user.toString() !== userId) {
    throw new ForbiddenException(
      'You do not have permission to perform this action'
    );
  }
};

module.exports = {
  createComment,
  updateCommentById,
  deleteCommentById,
  getCommentsByPostId,
};
