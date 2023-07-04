// models
const brandModel = require("../models/brandModel");

// helpers
const { arabicFullDate, slugHandler } = require("../helpers/setOfHelpers");
const { isExesistingAndVisible } = require("../helpers/crudHelper");
const ApiError = require("../helpers/apiError");
const FeaturesApi = require("../helpers/featuresApi");

// controllers

exports.getVisibleBrands = async (req, res, next) => {
  try {
    const documentCount = await brandModel.countDocuments({ visible: true });
    const query = new FeaturesApi(brandModel.find(), req.query, true)
      .paginate(documentCount)
      .filter()
      .search()
      .fields()
      .sort();

    const { reqQuery, pagination } = query;
    const allBrands = await reqQuery;
    if (allBrands) {
      res.status(200).json({ pagination, allBrands });
    } else {
      return next(new ApiError(`can't find any brand..!`, 404));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getSpecificBrand = async (req, res, next) => {
  try {
    const id = req.params.id && req.params.id;

    if (id) {
      const specificBrand = await isExesistingAndVisible(brandModel, id);
      if (specificBrand) {
        res.status(200).json(specificBrand);
      } else
        return next(new ApiError(`can't find this brand with id: ${id}`, 404));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};
