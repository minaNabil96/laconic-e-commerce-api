// models
const productModel = require("../models/productModel");
const subCategoryModel = require("../models/subCategoryModel");
const brandModel = require("../models/brandModel");
const userModel = require("../models/userModel");
// helpers
const { arabicFullDate, slugHandler } = require("../helpers/setOfHelpers");
const { isExesistingAndVisible } = require("../helpers/crudHelper");
const ApiError = require("../helpers/apiError");
const FeaturesApi = require("../helpers/featuresApi");
const { jwtVerification, jwtFullVerification } = require("../helpers/auth");
// controllers

exports.getVisibleProducts = async (req, res, next) => {
  try {
    const documentCount = await productModel.countDocuments({ visible: true });
    const query = new FeaturesApi(productModel.find(), req.query, true)
      .paginate(documentCount)
      .filter()
      .search()
      .fields()
      .sort();

    const { reqQuery, pagination } = query;
    const products = await reqQuery.populate({ path: "offer" });
    if (products) {
      res.status(200).json({ pagination, products });
    } else {
      return next(new ApiError(`can't find any products..!`, 404));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getSpecificProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId && req.params.productId;
    if (productId) {
      const findSpecificProduct = await isExesistingAndVisible(
        productModel,
        productId
      );
      if (findSpecificProduct) {
        const specificProduct = await productModel
          .findById({ _id: productId })
          .populate({ path: "offer" });
        // .select("-ratingsAndComments");
        res.status(200).json([specificProduct]);
      } else
        return next(
          new ApiError(
            `can't find this product with productId: ${productId}`,
            404
          )
        );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getProductsBySubCategories = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    if (subCategoryId) {
      const checkedSubCategory = await isExesistingAndVisible(
        subCategoryModel,
        subCategoryId
      );
      if (checkedSubCategory) {
        const documentCount = await productModel.countDocuments({
          visible: true,
          subCategory: subCategoryId,
        });
        const query = new FeaturesApi(
          productModel.find({ subCategory: subCategoryId }),
          req.query,
          true
        )
          .paginate(documentCount)
          .filter()
          .search()
          .fields()
          .sort();

        const { reqQuery, pagination } = query;
        const productsBySubCategory = await reqQuery.populate({
          path: "subCategory category",
          select: "name",
        });
        if (productsBySubCategory) {
          res.status(200).json({ pagination, productsBySubCategory });
        } else {
          return next(new ApiError(`sorry an error occurred`, 404));
        }
      } else {
        return next(
          new ApiError(
            `can't find this subCategory with subCategoryId: ${subCategoryId}`,
            404
          )
        );
      }
    } else {
      return next(new ApiError(`missing dep`, 404));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getProductsByBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    if (brandId) {
      const checkedBrand = await isExesistingAndVisible(brandModel, brandId);
      if (checkedBrand) {
        const documentCount = await productModel.countDocuments({
          visible: true,
          brand: brandId,
        });
        const query = new FeaturesApi(
          productModel.find({ brand: brandId }),
          req.query,
          true
        )
          .paginate(documentCount)
          .filter()
          .search()
          .fields()
          .sort();

        const { reqQuery, pagination } = query;
        const productsByBrand = await reqQuery;
        if (productsByBrand) {
          res.status(200).json({ pagination, productsByBrand });
        } else {
          return next(new ApiError(`sorry an error occurred`, 404));
        }
      } else {
        return next(
          new ApiError(`can't find this brand with brandId: ${brandId}`, 404)
        );
      }
    } else {
      return next(new ApiError(`missing dep`, 404));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};
