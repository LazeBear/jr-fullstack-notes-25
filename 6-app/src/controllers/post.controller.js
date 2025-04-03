const ForbiddenException = require('../exceptions/forbidden.exception');
const NotFoundException = require('../exceptions/notFound.exception');
const commentModel = require('../models/comment.model');
const HashtagModel = require('../models/hashtag.model');
const LikeModel = require('../models/like.model');
const PostModel = require('../models/post.model');

const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const post = new PostModel({
      title,
      content,
      user: req.user.id,
    });
    // await post.save();

    // const post = await PostModel.create({
    //   title,
    //   content,
    //   user: req.user.id,
    // });

    // extract hashtags
    const hashtags = extractHashtags(content);
    if (hashtags.length > 0) {
      const hashtagDocs = await Promise.all(
        hashtags.map((h) =>
          HashtagModel.createOrUpdateHashtagByName(h, post._id)
        )
      );
      post.hashtags = hashtagDocs.map((d) => d._id);
    }
    await post.save();

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
    const { content } = req.body;
    const post = await PostModel.findByIdOrFail(req.params.id);
    // {content:"xxxx",title: undefined};
    // new PostModel(req.body);
    // check user owns the resource/post
    checkUserOwnsPost(post, req.user.id);
    const newHashtags = extractHashtags(content);
    await post.populate('hashtags');
    const oldHashtags = post.hashtags.map(({ name }) => name);
    const { addedHashtags, removedHashtags } = getHashtagDiffs(
      oldHashtags,
      newHashtags
    );

    if (addedHashtags.length > 0 || removedHashtags.length > 0) {
      const addedHashtagDocs =
        addedHashtags.length > 0
          ? await Promise.all(
              addedHashtags.map((h) =>
                HashtagModel.createOrUpdateHashtagByName(h, post._id)
              )
            )
          : [];

      if (removedHashtags.length > 0) {
        const removedHashtagIds = post.hashtags
          .filter((tag) => removedHashtags.includes(tag.name))
          .map((t) => t._id);

        await HashtagModel.updateMany(
          {
            _id: { $in: removedHashtagIds },
          },
          {
            $pull: {
              recentPosts: post._id,
            },
            $inc: { postsCount: -1 },
          }
        ).exec();
      }
      // remaining = old - removed
      const remainingHashtagIds = post.hashtags
        .filter((tag) => !removedHashtags.includes(tag.name))
        .map((t) => t._id);
      // new hashtag ids = remaining hashtags + new hashtags
      post.hashtags = [
        ...addedHashtagDocs.map((doc) => doc._id),
        ...remainingHashtagIds,
      ];
    }

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
    await HashtagModel.updateMany(
      {
        _id: { $in: post.hashtags },
      },
      {
        $pull: {
          recentPosts: post._id,
        },
        $inc: { postsCount: -1 },
      }
    ).exec();
    await commentModel.deleteMany({ post: post._id }).exec();
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

// GET /posts/:id/likes
// GET /users/me
const getUserPostLikes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const likes = await LikeModel.find({ user: userId, post: id }).exec();

    let postLike = null;
    const commentLikes = [];
    likes.forEach((like) => {
      if (like.targetType === 'Post') {
        postLike = like._id;
      } else {
        commentLikes.push(like._id);
      }
    });

    const response = {
      post: postLike,
      comments: commentLikes,
    };
    res.json({ success: true, data: response });
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

// hello #hi #hello #hi,xxxx
const extractHashtags = (content) => {
  const hashtags = content.match(/#[a-zA-Z0-9_]+/g) || [];
  return [...new Set(hashtags.map((h) => h.slice(1)))];
};

const getHashtagDiffs = (oldHashtags, newHashtags) => {
  const oldHashtagsSet = new Set(oldHashtags);
  const newHashtagsSet = new Set(newHashtags);
  const addedHashtags = newHashtags.filter((tag) => !oldHashtagsSet.has(tag));
  const removedHashtags = oldHashtags.filter((tag) => !newHashtagsSet.has(tag));
  return {
    addedHashtags,
    removedHashtags,
  };
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getUserPostLikes,
};
