const express = require("express");

const router = express.Router();

const {
  getVisibleSubCategories,
  getSpecificSubCategory,
  getSubCategoriesWithSpecificCategory,
} = require("../controllers/subCategoriesController");

router.route("/").get(getVisibleSubCategories);
router.route("/:id").get(getSpecificSubCategory);
router.route("/by-category").post(getSubCategoriesWithSpecificCategory);

module.exports = router;
