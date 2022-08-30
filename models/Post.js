const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Comment = require("./Comment");

const postSchema = new Schema(
  {
    user_name: { type: String, required: true },
    content: { type: String, required: true },
    image_url: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ["public", "private"], default: "public" },
    likes: [{ type: String, ref: "user" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comments" }],
  },
  { timestamps: true }
);

postSchema.post("remove", async (doc) => {
  for (const id of doc.comments) {
    await Comment.findOneAndupdate(
      { _id: id },
      { isActive: false },
      { new: true }
    );
  }
});

postSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

postSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});


const Post = model("posts", postSchema);
module.exports = Post;
