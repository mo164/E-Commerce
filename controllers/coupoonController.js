const coupon = require("../models/couponModel");
const handlerFunction = require("../utils/handlerFunction");

exports.createcoupon = handlerFunction.createOne(coupon);
exports.getcoupon = handlerFunction.getOne(coupon);
exports.getAllcoupons = handlerFunction.getAll(coupon);
exports.updatebcoupon = handlerFunction.updateOne(coupon);
exports.deletebcoupon = handlerFunction.deleteOne(coupon);
