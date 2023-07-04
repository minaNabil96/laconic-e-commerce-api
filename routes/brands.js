const express = require("express");

const router = express.Router();

const {
  getVisibleBrands,
  getSpecificBrand,
} = require("../controllers/brandsController");

router.route("/").get(getVisibleBrands);
router.route("/:id").get(getSpecificBrand);
module.exports = router;
