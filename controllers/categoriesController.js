// models
const categoryModel = require("../models/categoryModel");

// helpers
const { arabicFullDate, slugHandler } = require("../helpers/setOfHelpers");
const { isExesistingAndVisible } = require("../helpers/crudHelper");

const ApiError = require("../helpers/apiError");
const FeaturesApi = require("../helpers/featuresApi");

// controllers

exports.getVisibleCategories = async (req, res, next) => {
  try {
    const documentCount = await categoryModel.countDocuments({
      visible: true,
    });
    const query = new FeaturesApi(categoryModel.find(), req.query, true)
      .paginate(documentCount)
      .filter()
      .search()
      .fields()
      .sort();

    const { reqQuery, pagination } = query;
    const allCategories = await reqQuery;
    if (allCategories) {
      res.status(200).json({ pagination, allCategories });
    } else {
      return next(new ApiError(`can't find any categories..!`, 404));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getSpecificCategory = async (req, res, next) => {
  try {
    const id = req.params.id && req.params.id;

    if (id) {
      const specificCategory = await isExesistingAndVisible(categoryModel, id);
      if (specificCategory) {
        res.status(200).json(specificCategory);
      } else
        return next(
          new ApiError(`can't find this category with id: ${id}`, 404)
        );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};
