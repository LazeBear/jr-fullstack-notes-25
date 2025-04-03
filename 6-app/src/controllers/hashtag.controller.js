const HashtagModel = require('../models/hashtag.model');

const getPopularHashtags = async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const skip = (page - 1) * limit;

    const hashtags = await HashtagModel.find()
      .populate({
        path: 'recentPosts',
        select: 'title content',
        populate: {
          path: 'user',
          select: 'username',
        },
      })
      .sort({ postsCount: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    res.json({
      success: true,
      data: hashtags,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getPopularHashtags,
};
