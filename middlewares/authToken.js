const JWT = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const User = require("../models/user.model");

exports.authToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next(new CustomError("You are not logged in! Please login again", 401));
    }

    const token = authHeader.split(" ")[1];

    // verify token
    const decodedToken = JWT.verify(token, process.env.LOGIN_SECRET_KEY);

    // Fetch user
    const user = await User.findById(decodedToken._id);

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new CustomError("Invalid or expired token", 401));
    }
    next(error);
  }
};
