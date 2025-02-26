const subCategoryModel = require("../models/subCategoryModel")
const handlerFunction = require("../utils/handlerFunction")

exports.createSubCategory = handlerFunction.createOne(subCategoryModel) 
exports.getSubCategory = handlerFunction.getOne(subCategoryModel)
exports.getAllCategories = handlerFunction.getAll(subCategoryModel)
exports.updateSubCategory = handlerFunction.updateOne(subCategoryModel)
exports.deleteSubCategory = handlerFunction.deleteOne(subCategoryModel)