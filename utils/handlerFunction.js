/* eslint-disable no-use-before-define */
const asyncHandler = require("express-async-handler");

//const { options } = require('nodemon/lib/config');
const AppError = require("./appErorr");

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    // إذا لم يتم تحديد الفئة، استخدم الفئة من الـ params
    if (!req.body.category) req.body.category = req.params.categoryId;

    // التأكد من أن الطلب يحتوي على productId (للمراجعات)
    if (Model.modelName === "Review" && !req.body.product) {
      return next(new AppError("Product ID is required", 400));
    }

    // التحقق من وجود مراجعة سابقة لنفس المنتج من نفس المستخدم
    if (Model.modelName === "Review") {
      const existingReview = await Model.findOne({
        user: req.user._id,
        product: req.body.product,
      });

      if (existingReview) {
        return next(
          new AppError("You have already added a review for this product", 400)
        );
      }
    }

    // إنشاء المستند في قاعدة البيانات
    const doc = await Model.create(req.body);

    res.status(201).json({
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;
    if (!doc) {
      // eslint-disable-next-line new-cap
      return next(new AppError(`No doc for this id ${id}`, 404));
    }
    res.status(200).json({ data: doc });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    // Step 1: Build Query Object

    let queryObj = { ...req.query };

    // Exclude specific fields used for functionality
    const excludeFields = ["page", "sort", "limit", "fields", "keyword"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handling filtering operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = JSON.parse(queryStr);

    // Advanced Filters
    if (req.params.categoryId) {
      query.category = req.params.categoryId;
    }

    if (Model.modelName === "Order") {
      query.user = req.user._id;
    }

    // Keyword search (text search)
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: new RegExp(req.query.keyword, "i") } },
        { description: { $regex: new RegExp(req.query.keyword, "i") } },
      ];
    }

    // Step 2: Create Mongoose Query
    let mongooseQuery = Model.find(query);

    // Step 3: Pagination
    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      mongooseQuery = mongooseQuery.skip(skip).limit(limit);
    }

    // Step 4: Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
      mongooseQuery = mongooseQuery.sort("createdAt");
    }

    // Step 5: Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      mongooseQuery = mongooseQuery.select(fields);
    } else {
      mongooseQuery = mongooseQuery.select("-__v");
    }

    // Step 6: Execute the query
    try {
      const docs = await mongooseQuery;
      res.status(200).json({
        results: docs.length,
        data: docs,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // eslint-disable-next-line no-undef
    if (!doc) {
      // eslint-disable-next-line new-cap
      return next(new AppError(`No doc for this id =`, 404));
    }
    doc.save();
    res.status(200).json({ data: doc });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      // eslint-disable-next-line new-cap
      return next(new AppError(`No doc for this id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.deleteAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    await Model.deleteMany({});

    res.status(200).json({
      message: "all docs deleted successfully",
    });
  });
