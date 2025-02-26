/* eslint-disable import/no-unresolved */
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const handlerFunction = require("../utils/handlerFunction");
const { uploadSingleImage } = require("./../middlewares/uploadimageMiddleware");
const AppErorr = require("../utils/appErorr");
const generateToken = require("../utils/generateToken");

exports.uploadUserImage = uploadSingleImage("profileImg");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});
exports.createUser = handlerFunction.createOne(User);
exports.getUser = handlerFunction.getOne(User);
exports.getAllUsers = handlerFunction.getAll(User);

exports.updateUserData = asyncHandler(async (req, res, next) => {
  req.body.password &&
    next(new AppErorr("This route for updating data only, not passwords", 404));
  const doc = await User.findByIdAndUpdate(
    req.params.id,

    {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!doc) {
    return next(new AppErorr(`No user for this id `, 404));
  }
  res.status(200).json({ data: doc });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  // Get the user from collection
  const user = await User.findById(req.params.id).select("+password");
  if (!user) {
    return next(new AppErorr("no user with this id", 401));
  }
  // 2) check if current posted password is correct using correctPassword
  const isCorrect = await user.correctPassword(
    req.body.currentPassword,
    user.password
  );
  if (!isCorrect) {
    return next(new AppErorr("Your current password is incorrect", 401));
  }

  // 3) if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now();

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

exports.deleteUser = handlerFunction.deleteOne(User);

exports.getLogeduser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profile,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});

exports.ensureActiveUser = asyncHandler(async (req, res, next) => {
  if (!req.user.active) {
    return next(new AppErorr("Your account is not active to do this action", 403));
  }
  next();
});

// exports.firstComment = asyncHandler(async (req, res, next) => {
//   const { product } = req.body; // استخراج ID المنتج من الطلب

//   console.log("Incoming Review Request:", req.body.product); // تتبع الطلب
//   console.log("User ID:", req.user._id); // تتبع معرف المستخدم

//   if (!product) {
//     return next(new AppErorr("Product ID is required", 400));
//   }

//   const existingReview = await Review.findOne({
//     user: req.user._id.toString(),
//     product: product.toString(),
//   });

//   console.log("Existing Review Found:", existingReview); // تتبع هل هناك مراجعة سابقة

//   if (existingReview) {
//     return next(new AppErorr("You have already added a review for this product", 400));
//   }

//   next(); // السماح للمستخدم بإضافة المراجعة
// });

