const multer = require("multer");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const Product = require("../models/productModel");
const handlerFunction = require("../utils/handlerFunction");
const {multerFilter,multerStorage} = require("../middlewares/uploadImageMiddleware")

exports.top_5 = (req, res, next) => {
  req.query.limit = '5';  
  req.query.sort = '-price';  
  req.query.fields = 'name,price';  
  next();  
};


const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.UploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);
exports.resizeAll = asyncHandler(async (req, res, next) => {
  req.body.images = [];
  if (req.files.imageCover) {
    const filename = `product-Cover-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${filename}`);

    req.body.imageCover = filename;
  }
  // IMAGE PROCESSING FOR IMAGES
  if (req.files.images) {
    req.body.images = [];
    const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;
    await Promise.all(
      req.files.images.map(async (img, index) => {
        await sharp(img.buffer)
          .resize(2000, 1300)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${filename}-${index + 1}`);

        req.body.images.push(filename);
      })
    );
    console.log(req.files);
    next();
  }
});

exports.createProudct = handlerFunction.createOne(Product);
exports.getProudct = handlerFunction.getOne(Product,"reviews");
exports.getAllProudcts = handlerFunction.getAll(Product);
exports.updateProudct = handlerFunction.updateOne(Product);
exports.deleteProudct = handlerFunction.deleteOne(Product);
exports.deleteAllProudcts = handlerFunction.deleteAll(Product);
