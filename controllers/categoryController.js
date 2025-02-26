const asyncHandler = require("express-async-handler");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Category = require("../models/categoryModel");
const handlerFunction = require("../utils/handlerFunction");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const appErorr = require("../utils/appErorr");

exports.addCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});
exports.createCategory = handlerFunction.createOne(Category);

exports.getAllCategories = handlerFunction.getAll(Category)

exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    // eslint-disable-next-line new-cap
    return next(new appErorr(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!category) {
    // eslint-disable-next-line new-cap
    return next(new appErorr(`No category for this id `, 404));
  }
  res.status(200).json({ data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    // eslint-disable-next-line new-cap
    return next(new appErorr(`No category for this id ${id}`, 404));
  }
  res.status(204).json({ message: "deleted" });
});
