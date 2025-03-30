const mongoose = require('mongoose');
const NotFoundException = require('../exceptions/notFound.exception');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // -> _id (ObjectId)
      ref: 'User',
      required: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.statics.findByIdOrFail = async function (id) {
  const post = await this.findById(id).exec();
  if (!post) {
    throw new NotFoundException(`Post not found: ${id}`);
  }
  return post;
};

postSchema.index({
  title: 'text',
  content: 'text',
});

module.exports = mongoose.model('Post', postSchema);
