const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Post = require("./Post");

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamp: true }
);

commentSchema.post("remove", async (doc) => {
  const comment = doc;
  const post = await Post.findOne({ comments: { $in: [comment._id] } });
  await Post.findOneAndUpdate(
    { _id: post._id },
    { $pull: { comments: comment._id } }
  );
});

const Comments = model("comments", commentSchema);
module.exports = Comments;
