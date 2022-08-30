const express = require("express");
const { GlobalMiddleWare } = require("../middlewares/middleware");
const { UserVaidators } = require("../validators/user");
const UserController = require("../controllers/user")
const router = express.Router();



router.post("/signup", UserVaidators.signup(), GlobalMiddleWare.checkError, UserController.signUp)
router.get("/login", UserVaidators.login(), GlobalMiddleWare.checkError, UserController.login)
router.get("/logout", GlobalMiddleWare.authenticate, UserController.logout)
router.put("/follow", GlobalMiddleWare.authenticate, UserController.follow)
router.put("/unfollow", GlobalMiddleWare.authenticate, UserController.unfollow)

router.get("/profile", GlobalMiddleWare.authenticate, UserController.profile)

module.exports = router;