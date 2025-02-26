const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const appError = require("./../utils/appErorr");
const getTotal = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create cart fot logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in your cart & update Quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() == productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart,  push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  getTotal(cart);
  await cart.save();
  res.status(200).json({
    result: cart.cartItems.length,
    cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  res.status(200).json({
    result: cart.cartItems.length,
    cart,
  });
});

exports.deleteSpecificCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.removeitem } },
    },
    { new: true }
  );
  getTotal(cart);
  res.status(200).json({
    message: " item deleted successfully from your cart",
    cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

exports.upadateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new appError("no cart found to this user", 404));

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const item = cart.cartItems[itemIndex];
    item.quantity = quantity;
    cart.cartItems[itemIndex] = item;
  } else return next(new appError("product not found", 404));
  getTotal(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.apllyCoupon = asyncHandler(async (req, res,next) => {
  const { couponName } = req.body;
  const coupon = await Coupon.findOne({
    name: couponName,
    expire: { $gt: Date.now() },
  });

  if (!coupon) return next(new appError("coupon not found", 404));

  const userCart = await Cart.findOne({ user: req.user.id });
  if (!userCart) return next(new appError("no cart found for this user", 404));

  const priceAfterDiscount = (
    userCart.totalCartPrice -
    (userCart.totalCartPrice * coupon.discount) / 100
  ).toFixed(2);

  userCart.totalPriceAfterDiscount = priceAfterDiscount;
  await userCart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: userCart.cartItems.length,
    data: userCart,
  });
});
