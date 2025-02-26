/* eslint-disable import/order */
const { v4: uuidv4 } = require("uuid");

const Brand = require("../models/brandModel");
const handlerFunction = require("../utils/handlerFunction");

const uploadImage = require("./../middlewares/uploadimageMiddleware");

const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
// eslint-disable-next-line import/order
exports.uploadBrandImage = uploadImage.uploadSingleImage("image");


exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  // Save image into our db
  req.body.image = req.hostname + filename;

  next();
});
exports.createBrand = handlerFunction.createOne(Brand);
exports.getBrand = handlerFunction.getOne(Brand);
exports.getAllBrands = handlerFunction.getAll(Brand);
exports.updatebBrand = handlerFunction.updateOne(Brand);
exports.deletebBrand = handlerFunction.deleteOne(Brand);
