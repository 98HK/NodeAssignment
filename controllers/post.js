const Post = require("../models/Post");

module.exports.addPost = async (req, res, next) => {
  const userId = req.user.user_name;
  const content = req.body.content;
  const fileUrl = "http://localhost:5151/" + req.file.path;
  const post = new Post({
    user_name: userId,
    content: content,
    image_url: fileUrl,
  });
  post
    .save()
    .then((post) => {
      res.send(post);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.editPost = async (req, res, next) => {
  const content = req.body.content;
  const fileUrl = "http://localhost:5151/" + req.file.path;
  const postId = req.params.id;
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { content: content, image_url: fileUrl },
      { new: true }
    ).populate("comments");
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      throw new Error("Post Does Not Exist");
    }
  } catch (error) {
    next(error);
  }
};

module.exports.deletePost = async (req, res, next) => {
  const post = req.post;
  try {
    await post.updateOne({ post: post, isActive: false });
    res.send("post deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports.getPostByUser = async (req, res, next) => {
  const userId = req.user.user_name;
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  let currentPage = page;
  let prevPage = page === 1 ? null : page - 1;
  let pageToken = page + 1;
  let totalPages;
  try {
    const postCount = await Post.countDocuments({ user_name: userId });
    totalPages = Math.ceil(postCount / perPage);
    if (totalPages === page || totalPages === 0) {
      pageToken = null;
    }
    if (page > totalPages) {
      throw Error("No More Post to Show");
    }
    const posts = await Post.find(
      { user_name: userId, isActive: true },
      { __v: 0, user_id: 0 }
    )
      .populate("comments")
      .skip(perPage * page - perPage)
      .limit(perPage);
    res.json({
      post: posts,
      pageToken: pageToken,
      totalPages: totalPages,
      currentPage: currentPage,
      prevPage: prevPage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllPost = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 2;
  let currentPage = page;
  let prevPage = page === 1 ? null : page - 1;
  let pageToken = page + 1;
  let totalPages;
  try {
    const postCount = await Post.estimatedDocumentCount();
    totalPages = Math.ceil(postCount / perPage);
    if (totalPages === page || totalPages === 0) {
      pageToken = null;
    }
    if (page > totalPages) {
      throw Error("No More Post to Show");
    }
    const posts = await Post.find({ isActive: true }, { __v: 0, user_id: 0 })
      .populate("comments")
      .skip(perPage * page - perPage)
      .limit(perPage);
    res.json({
      post: posts,
      pageToken: pageToken,
      totalPages: totalPages,
      currentPage: currentPage,
      prevPage: prevPage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getPostById = async (req, res, next) => {
  res.json({ post: req.post, CommentCount: req.post.commentCount });
};

module.exports.like = async (req, res, next) => {
  try {
    const post = req.body.postId;
    const userId = req.user.user_name;
    const doc = await Post.findByIdAndUpdate(
      post,
      {
        $push: { likes: userId },
      },
      { new: true }
    );
    if (doc) {
      res.send(doc);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.unlike = async (req, res, next) => {
  try {
    const post = req.body.postId;
    const userId = req.user.user_name;
    const doc = await Post.findByIdAndUpdate(
      post,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );
    if (doc) {
      res.send(doc);
    }
  } catch (error) {
    next(error);
  }
};