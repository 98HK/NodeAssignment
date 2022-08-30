const { body, param } = require("express-validator");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

class CommentVaidators {
  static addComment() {
    return [
      body("content", "Content is Required").isString(),
      param("id").custom((id, { req }) => {
        return Post.findOne({ _id: id }).then((post) => {
          if (post) {
            req.post = post;
            return true;
          } else {
            throw new Error("Post not found");
          }
        });
      }),
    ];
  }

  static editComment() {
    return [body("content", "Content is Required").isString()];
  }

  static deleteComment() {
    return [
      param("id").custom((id, { req }) => {
        return Comment.findOne({ _id: id }).then((comment) => {
          if (comment) {
            req.comment = comment;
            return true;
          } else {
            throw new Error("Comment Does Not Exist");
          }
        });
      }),
    ];
  }
}

exports.CommentVaidators = CommentVaidators;
