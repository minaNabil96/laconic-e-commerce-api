const express = require("express");

const router = express.Router();

const {
  getVisibleProducts,
  getSpecificProduct,
  getProductsBySubCategories,
  getProductsByBrand,
} = require("../controllers/productsController");

router.route("/").get(getVisibleProducts);
router.route("/:productId").get(getSpecificProduct);
router.route("/bysubcategory/:subCategoryId").get(getProductsBySubCategories);
router.route("/bybrand/:brandId").get(getProductsByBrand);

module.exports = router;
