const express = require("express");

const router = express.Router();

const {
  getVisibleCategories,
  getSpecificCategory,
} = require("../controllers/categoriesController");

router.route("/").get(getVisibleCategories);
router.route("/:id").get(getSpecificCategory);
module.exports = router;
