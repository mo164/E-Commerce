const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const app = express();
const appError = require("./utils/appErorr");
const globalErrorHandling = require("./middlewares/globalErrorHandling");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoriesRoutes = require("./routes/subCategoryRoutes");
const brandsRoutes = require("./routes/brandRoutes");
const productsRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const adressesRoutes = require("./routes/adressesRoutes");
const couponRoutes = require("./routes/couponRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderController = require("./controllers/orderController");
// MIDELEWARES
app.use(morgan("dev"));

if (process.env.NODE_ENV === "development") {
  console.log("you are in dev mode");
} else {
  console.log("you are in production mode");
}

app.use(express.json());
// enable cors
app.use(cors());
app.options("*", cors());
// compress all responses
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  orderController.webhookCheckout
);

app.use(express.static(path.join(__dirname, "uploads")));

// MOUTNTING ROUTES
app.use("/api/category", categoryRoutes);
app.use("/api/subcategories", subCategoriesRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/adresses", adressesRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.all("*", (req, res, next) => {
  // eslint-disable-next-line new-cap
  next(new appError("this route is not defined", 400));
});

// GLOBAL ERROR HANDLING MIDDLEWARE FOR EXPRESS
app.use(globalErrorHandling);

module.exports = app;
