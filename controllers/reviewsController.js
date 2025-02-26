const asyncHandler = require("express-async-handler");
const AppErorr = require("../utils/appErorr");

const Review = require("./../models/reviewModel");
const handlerFunction = require("./../utils/handlerFunction");

exports.createReview = handlerFunction.createOne(Review);
exports.getReview = handlerFunction.getOne(Review)
exports.getAllReviews = handlerFunction.getAll(Review);
exports.updateReview = handlerFunction.updateOne(Review);
exports.deleteReview = handlerFunction.deleteOne(Review);
exports.deleteAllReviews = handlerFunction.deleteAll(Review);
exports.getAllReviewsOnAProduct = asyncHandler (async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId }); // Find reviews by product ID

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

exports.set = asyncHandler(async (req, res,next) => {
    if(req.params.productId){
        req.body.product = req.params.productId
    }
    req.body.user = req.user._id
    next()
})