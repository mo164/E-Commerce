/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const AppErorr = require("../utils/appErorr");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

generateToken = function (userId) {
  return jwt.sign({ userId: userId }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.EXPIRES_IN,
  });
};
exports.signUp = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  // Generate token
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.EXPIRES_IN,
  });

  // Send response (excluding sensitive data)
  res.status(201).json({
    data: user,
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    throw new AppErorr("Email or password is empty", 401);
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password"); // Include password in query
  if (!user) {
    throw new AppErorr("No user with this email", 401);
  }

  // Validate password
  const isPasswordCorrect = await user.correctPassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppErorr("Invalid email or password", 401);
  }

  // Generate token
  const token = generateToken(user._id);

  // Send response (excluding sensitive data)
  res.status(200).json({
    data: user,
    token,
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // check if token is exists & if exists get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppErorr("your are not login", 401));
  }

  // verify token (changed&expired)
  const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

  // 3) check if the user is still exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new AppErorr("user is not exist", 401));
  }
  // check if the user change the password after the token created

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppErorr("user recently changed password.. pls login again", 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not authenticated. Please log in", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to access this route", 403)
      );
    }

    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppErorr("no user with this email", 404));
  }
  // 2) if user exists generate hash  reset random 6 digits and save it to db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedresetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedresetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    console.log(err);
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    return next(new AppErorr("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const hashed = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashed,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new AppErorr("Invalid password reset code or expired password")
    );
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "Success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppErorr("no user found with this email", 404));

  // check passwordResetVerified true
  if (!user.passwordResetVerified) {
    return next(new AppErorr("password reset not verified", 400));
  }
  // if true
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = generateToken(user._id);
  res.status(200).json({ token });
});
