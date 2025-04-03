const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.statics.findByIdOrFail = async function (id) {
  const comment = await this.findById(id).exec();
  if (!comment) {
    throw new NotFoundException(`Comment not found: ${id}`);
  }
  return comment;
};

module.exports = mongoose.model('Comment', commentSchema);
