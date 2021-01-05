const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require('../utils/sendEmail')

// #опис        Register a user
// #патека      POST /api/v1/register
// #пристап     Јавен
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "avatars/user_odi44a",
      url:
        "https://res.cloudinary.com/sauromanih/image/upload/v1609747930/avatars/user_odi44a.png",
    },
  });

  // send token to cookie
  sendToken(user, 200, res);
});

// #опис        Login a user
// #патека      POST /api/v1/login
// #пристап     Privaten
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password are entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //check if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // send token to cookie
  sendToken(user, 200, res);
});

// #опис        Forgot Password
// #патека      POST /api/v1/password/forgot
// #пристап     Privaten
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset tokein is as follow: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Eshop Password Recovery",
      message,
    });

    res
      .status(200)
      .json({ success: true, message: `Email send to: ${user.email} ` });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// #опис        Logout user
// #патека      GET /api/v1/logout
// #пристап     Privaten
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
