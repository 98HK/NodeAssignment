const express = require("express");
const router = express.Router();
const { GlobalMiddleWare } = require("../middlewares/middleware");
const { CommentVaidators } = require("../validators/comment");
const CommentController = require("../controllers/comment");
const { Utils } = require("../middlewares/Utils");

router.post("/add/:id", GlobalMiddleWare.authenticate, CommentVaidators.addComment(),GlobalMiddleWare.checkError,CommentController.addComment)

router.patch("/edit/:id", GlobalMiddleWare.authenticate, CommentVaidators.editComment(),GlobalMiddleWare.checkError, CommentController.editComment)

router.delete("/delete/:id", GlobalMiddleWare.authenticate, CommentVaidators.deleteComment(),GlobalMiddleWare.checkError, CommentController.deleteComment)

module.exports = router;
