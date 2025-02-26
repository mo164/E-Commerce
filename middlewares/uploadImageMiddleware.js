const multer = require("multer");
const appErorr = require("../utils/appErorr");


exports.multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    // eslint-disable-next-line new-cap
    cb(new appErorr("only images aloow", 400), false);
  }
};
exports.multerStorage = multer.memoryStorage();
exports.uploadSingleImage =(fieldName)=>{
const multerStorage = multer.memoryStorage();
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    // eslint-disable-next-line new-cap
    cb(new appErorr("only images aloow", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
return upload.single(fieldName)
}