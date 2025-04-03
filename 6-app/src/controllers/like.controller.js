// POST /posts/:postId/likes
// POST /comments/:commentId/likes

const ConflictsException = require('../exceptions/conflict.exception');
const ForbiddenException = require('../exceptions/forbidden.exception');
const NotFoundException = require('../exceptions/notFound.exception');
const CommentModel = require('../models/comment.model');
const LikeModel = require('../models/like.model');
const PostModel = require('../models/post.model');

// POST /likes body:{}

const createLike = async (req, res, next) => {
  // targetType, targetId
  try {
    const { targetType, targetId } = req.body;
    const Model = targetType === 'Post' ? PostModel : CommentModel;
    const target = await Model.findByIdOrFail(targetId);
    let postId;
    if (targetType === 'Post') {
      postId = target._id;
    } else {
      postId = target.post;
    }
    const userId = req.user.id;

    const existingLike = await LikeModel.findOne({
      user: userId,
      target: targetId,
      targetType,
    });

    if (existingLike) {
      throw new ConflictsException('Like already exists');
    }
    const like = new LikeModel({
      user: userId,
      post: postId,
      target: targetId,
      targetType,
    });
    await like.save();
    await Model.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } }).exec();

    res.status(201).json({ success: true, data: like });
  } catch (e) {
    next(e);
  }
};

// DELETE /likes/:id
const deleteLikeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const like = await LikeModel.findById(id).exec();
    if (!like) {
      throw new NotFoundException('Like not found');
    }
    if (like.user.toString() !== req.user.id) {
      throw new ForbiddenException('action not allowed');
    }
    await like.deleteOne();

    const Model = like.targetType === 'Post' ? PostModel : CommentModel;
    await Model.findByIdAndUpdate(like.target, {
      $inc: { likesCount: -1 },
    }).exec();
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createLike,
  deleteLikeById,
};
