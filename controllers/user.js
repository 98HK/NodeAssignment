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

module.exports.follow = async (req, res, next) => {
  try {
    const userId = req.user.user_name;
    const user = req.body.user_name;
    const other1 = await User.findOne({ user_name: userId });
    const other = await User.findOne({ user_name: user });
    const doc = await User.findOneAndUpdate(userId, {
      $push: { following: user },
    });
    await User.findOneAndUpdate(
      { user_name: user },
      { $push: { followers: userId } }
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
    const userId = req.user.user_name;
    const user = req.body.user_name;
    const other = await User.findOne({ user_name: user });
    const doc = await User.findOneAndUpdate(
      { user_name: userId },
      {
        $pull: { following: user },
      }
    );
    await User.findOneAndUpdate(
      { user_name: user },
      { $pull: { followers: userId } }
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
