const mongoose = require('mongoose');

const HashtagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Hashtag can only contain letters, numbers and underscore',
      ],
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    recentPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MAX_RECENT_POSTS = 2;

HashtagSchema.statics.createOrUpdateHashtagByName = async function (
  tagName,
  postId
) {
  // update operator
  return this.findOneAndUpdate(
    { name: tagName },
    {
      $inc: { postsCount: 1 },
      $push: {
        recentPosts: {
          $each: [postId],
          $slice: -MAX_RECENT_POSTS,
        },
      },
    },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('Hashtag', HashtagSchema);
