// models
const subCategoryModel = require("../models/subCategoryModel");
const categoryModel = require("../models/categoryModel");
// helpers
const { arabicFullDate, slugHandler } = require("../helpers/setOfHelpers");
const { isExesistingAndVisible } = require("../helpers/crudHelper");
const ApiError = require("../helpers/apiError");
const FeaturesApi = require("../helpers/featuresApi");

// controllers

exports.getVisibleSubCategories = async (req, res, next) => {
  try {
    const documentCount = await subCategoryModel.countDocuments({
      visible: true,
    });
    const query = new FeaturesApi(subCategoryModel.find(), req.query, true)
      .paginate(documentCount)
      .filter()
      .search()
      .fields()
      .sort();

    const { reqQuery, pagination } = query;
    const allSubCategories = await reqQuery;
    if (allSubCategories) {
      res.status(200).json({ pagination, allSubCategories });
    } else {
      return next(new ApiError(`can't find any subcategories..!`, 404));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getSpecificSubCategory = async (req, res, next) => {
  try {
    const id = req.params.id && req.params.id;
    if (id) {
      const specificSubCategory = await isExesistingAndVisible(
        subCategoryModel,
        id
      );
      if (specificSubCategory) {
        res.status(200).json(specificSubCategory);
      } else
        return next(
          new ApiError(`can't find this subcategory with id: ${id}`, 404)
        );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getSubCategoriesWithSpecificCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.body;
    if (categoryId) {
      const specificCategory = await isExesistingAndVisible(
        categoryModel,
        categoryId
      );
      if (specificCategory) {
        const subCategoriesWithCategoryId = await subCategoryModel
          .find({
            category: categoryId,
            visible: true,
          })
          .populate({ path: "category", select: "name _id" });
        if (subCategoriesWithCategoryId) {
          res.status(200).json(subCategoriesWithCategoryId);
        } else {
          return next(new ApiError(`sorry can't find any sub categories`));
        }
      } else
        return next(
          new ApiError(`can't find any category with id: ${categoryId}`, 404)
        );
    }
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
