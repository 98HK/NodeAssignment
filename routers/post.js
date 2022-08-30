const express = require("express");
const router = express.Router();
const { GlobalMiddleWare } = require("../middlewares/middleware");
const { PostVaidators } = require("../validators/post");
const PostController = require("../controllers/post");
const { Utils } = require("../middlewares/Utils");


router.post("/addPost", GlobalMiddleWare.authenticate, new Utils().multer.single('image'), PostVaidators.addPost(), GlobalMiddleWare.checkError, PostController.addPost)

router.put("/edit/:id", GlobalMiddleWare.authenticate, new Utils().multer.single('image'), PostVaidators.editPost(), GlobalMiddleWare.checkError, PostController.editPost)

router.delete("/delete/:id", GlobalMiddleWare.authenticate, PostVaidators.deletePost(), GlobalMiddleWare.checkError, PostController.deletePost)

router.get("/me", GlobalMiddleWare.authenticate, PostController.getPostByUser)

router.get("/all", GlobalMiddleWare.authenticate, PostController.getAllPost)

router.get("/:id", GlobalMiddleWare.authenticate, PostVaidators.getPostById(),
GlobalMiddleWare.checkError, PostController.getPostById)

router.put("/like", GlobalMiddleWare.authenticate, PostController.like)
router.put("/unlike", GlobalMiddleWare.authenticate, PostController.unlike)



module.exports = router;
