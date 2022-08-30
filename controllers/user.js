require("dotenv").config();
const { Utils } = require("../middlewares/Utils");
const User = require("../models/User");
const Jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res, next) => {
  try {
    const hash = await Utils.encryptPassword(req.body.password);
    let user = await new User({ ...req.body, password: hash }).save();
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  const password = req.body.password;
  const user = req.user;
  try {
    await Utils.comparePassword({
      plainPassword: password,
      encryptedPassword: user.password,
    });
    const token = Jwt.sign(
      { email: user.email, user_id: user._id, user_name: user.user_name },
      process.env.JWT_SECRTET,
      { expiresIn: "120d" }
    );
    user.token = token;
    user.lastlogin = Date.now();
    await user.save();
    const data = { user: user };
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  const user_id = req.user.user_id;
  try {
    const doc = await User.findOneAndUpdate({ _id: user_id }, { token: "" });
    if (doc) {
      return res.send("ACCOUNT LOGOUT SUCCESSFULLY");
    }
  } catch (error) {
    next(error);
  }
};

module.exports.followers = async (req, res, next) => {
  try {
    const user = req.body.userId;
    const userId = req.user.user_id;
    const doc = await User.findByIdAndUpdate(
      user,
      {
        $push: { followers: userId },
      },
      { new: true }
    );
    if (doc) {
      res.send(`${doc.name} is now following you`);
    } else {
      res.status(400).send(`somthing went wrong`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.unfollowers = async (req, res, next) => {
  try {
    const user = req.body.userId;
    const userId = req.user.user_id;
    const doc = await User.findByIdAndUpdate(
      user,
      {
        $pull: { followers: userId },
      },
      { new: true }
    );
    if (doc) {
      res.send(`${doc.name} is now Unfollowing you`);
    } else {
      res.status(400).send(`somthing went wrong`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.follow = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const user = req.body.userId;
    const other = await User.findById(user);
    const doc = await User.findByIdAndUpdate(
      userId,
      {
        $push: { following: user },
      },
      { new: true }
    );
    if (doc) {
      res.send(`You are now following ${other.name}`);
    } else {
      res.status(400).send(`somthing went wrong`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.unfollow = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const user = req.body.userId;
    const other = await User.findById(user);
    const doc = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: user },
      },
      { new: true }
    );
    if (doc) {
      res.send(`You are now Unfollowing ${other.name}`);
    } else {
      res.status(400).send(`somthing went wrong`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.profile = async (req, res, next) => {
  try {
    const user_name = req.user.user_name;
    const user = await User.find(
      { user_name: user_name },
      { __v: 0, token: 0, password: 0, _id: 0 }
    );
    res.send(user);
  } catch (error) {
    next(error);
  }
};
