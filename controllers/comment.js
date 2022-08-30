const Comment = require("../models/Comment");

module.exports.addComment = async (req, res, next) => {
  const content = req.body.content;
  const post = req.post;
  try {
    const comment = new Comment({
      content: content,
    });
    post.comments.push(comment);
    await Promise.all([comment.save(), post.save()]);
    res.send(comment);
  } catch (error) {
    next(error);
  }
};

module.exports.editComment = async (req, res, next) => {
  const content = req.body.content;
  const commentId = req.params.id;
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId },
      { content: content },
      { new: true }
    );
    if (updatedComment) {
      res.send(updatedComment);
    } else {
      throw new Error("Comment Does Not Exist");
    }
  } catch (error) {
    next(error);
  }
};

module.exports.deleteComment = async (req, res, next) => {
  const comment = req.comment;
  try {
    await comment.updateOne({ comment: comment, isActive: false });
    await 
    res.send("comment deleted successfully");
  } catch (error) {
    next(error);
  }
};
