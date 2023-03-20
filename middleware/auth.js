const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");


exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const token = req.headers['authorization'];
  const result = token ? token.substr(token.indexOf(' ') + 1) : false;

  if (!result) {
    return next(new ErrorHandler("please login to access this resource", 401));
  }

  const decodeData = jwt.verify(result, process.env.JWT_SECRET);

  req.user = await User.findById(decodeData.id);
  next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not alowed to access this resource`,
            403
          )
        );
      }
      next();
    };
  };