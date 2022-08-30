require("dotenv").config();
const express_validator = require("express-validator");
const Jwt = require("jsonwebtoken");

class GlobalMiddleWare {
  static checkError(req, res, next) {
    const error = (0, express_validator.validationResult)(req);
    if (!error.isEmpty()) {
      next(new Error(error.array()[0].msg));
    } else {
      next();
    }
  }
  static authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
    try {
      Jwt.verify(token, process.env.JWT_SECRTET, (err, decoded) => {
        if (err) {
          next(err);
        } else if (!decoded) {
          req.errorStatus = 401;
          next(new Error("Not Authorized"));
        } else {
          req.user = decoded;
          next();
        }
      });
    } catch (error) {
      req.errorStatus = 401;
      next(error);
    }
  }
}


exports.GlobalMiddleWare = GlobalMiddleWare;