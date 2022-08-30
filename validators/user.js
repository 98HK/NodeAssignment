const { body } = require("express-validator");
const User = require("../models/User");

class UserVaidators {
  static signup() {
    return [
      body("email_id", "Email is Required")
        .isEmail()
        .custom((email_id, { req }) => {
          return User.findOne({ email_id: email_id }).then((user) => {
            if (user) {
              throw new Error("User Already Exists");
            } else {
              return true;
            }
          });
        }),
      body("password", "Password is Required")
        //   .isStrongPassword({
        //     minLength: 8,
        //     minLowercase: 1,
        //     minUppercase: 1,
        //     minNumbers: 1
        // })
        .isAlphanumeric()
        .isLength({ min: 8, max: 15 })
      // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
      .withMessage("Password should be atleast 8 characters long"),
      body("user_name", "Username is Required")
        .isString()
        .custom((user_name, { req }) => {
          return User.findOne({ user_name: user_name }).then((userName) => {
            if (userName) {
              throw new Error("UserName Already Used");
            } else {
              return true;
            }
          });
        }),
      body("mobile", "Mobile No. Is Required")
        .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i)
        .isLength({ min: 12, max: 15 })
        .withMessage("Mobile No should be with country code(+910000000000)"),
    ];
  }
  static login() {
    return [
      body("email_id", "Email is Required")
        .isEmail()
        .custom((email_id, { req }) => {
          return User.findOne({ email_id: email_id }).then((user) => {
            if (user) {
              req.user = user;
              return true;
            } else {
              throw new Error("User does not exist");
            }
          });
        }),
      body("password", "Password is Required").isAlphanumeric(),
    ];
  }
}

exports.UserVaidators = UserVaidators;
