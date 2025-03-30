const ForbiddenException = require('../exceptions/forbidden.exception');
const NotFoundException = require('../exceptions/notFound.exception');
const commentModel = require('../models/comment.model');
const PostModel = require('../models/post.model');

const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // const post = new postModel({
    //   title,
    //   content,
    //   user: req.user.id
    // });
    // await post.save();

    const post = await PostModel.create({
      title,
      content,
      user: req.user.id,
    });
    res.status(201).json({ success: true, data: post });
  } catch (e) {
    next(e);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    // pagination, search
    const { page, limit, q } = req.query;

    // water, watermelon -> $regex
    const searchQuery = q ? { $text: { $search: q } } : {};

    const posts = await PostModel.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    // const total = await PostModel.countDocuments().exec();
    // infinite scroll
    res.json({
      success: true,
      data: posts,
      // pagination: {page, limit, total, totalPage}
    });
  } catch (e) {
    next(e);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate('user', 'username')
      .exec();

    if (!post) {
      throw new NotFoundException(`Post not found ${req.params.id}`);
    }
    res.json({
      success: true,
      data: post,
    });
  } catch (e) {
    next(e);
  }
};

const updatePostById = async (req, res, next) => {
  try {
    const post = await PostModel.findByIdOrFail(req.params.id);
    // {content:"xxxx",title: undefined};
    // new PostModel(req.body);
    // check user owns the resource/post
    checkUserOwnsPost(post, req.user.id);
    post.set(req.body);
    await post.save();
    res.json({
      success: true,
      data: post,
    });
  } catch (e) {
    next(e);
  }
};

const deletePostById = async (req, res, next) => {
  try {
    const post = await PostModel.findByIdOrFail(req.params.id);
    checkUserOwnsPost(post, req.user.id);
    await post.deleteOne();
    await commentModel.deleteMany({ post: post._id }).exec();
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

// post -> mongoose document
const checkUserOwnsPost = (post, userId) => {
  if (post.user.toString() !== userId) {
    throw new ForbiddenException(
      'You do not have permission to perform this action'
    );
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
