const { body, param } = require("express-validator");
const Post = require("../models/Post");

class PostVaidators {
  static addPost() {
    return [
      body("content", "Post content is Required").isString(),
      body("image").custom((profilePic, { req }) => {
        if (req.file) {
          return true;
        } else {
          throw new Error("File not Uploaded");
        }
      }),
    ];
  }

  static getPostById() {
    return [
      param("id").custom((id, { req }) => {
        return Post.findOne({ _id: id }).then((post) => {
          if (post) {
            req.post = post;
            return true;
          } else {
            throw new Error("Post does not exist");
          }
        });
      }),
    ];
  }

  static editPost() {
    return [
      body("content", "Content is Required").isString(),
      body("image").custom((profilePic, { req }) => {
        if (req.file) {
          return true;
        } else {
          throw new Error("File not Uploaded");
        }
      }),
    ];
  }

  static deletePost() {
    return [
      param("id").custom((id, { req }) => {
        return Post.findOne({ _id: id }).then((post) => {
          if (post) {
            req.post = post;
            return true;
          } else {
            throw new Error("Post does not exist");
          }
        });
      }),
    ];
  }
}

exports.PostVaidators = PostVaidators;
