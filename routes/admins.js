const express = require("express");

const router = express.Router();
const {
  getAllUsers,
  forbidSpecificUser,
  getAllCategories,
  createCategory,
  hideSpecificCategory,
  getAllBrands,
  createBrand,
  editBrand,
  hideSpecificBrand,
  createSubCategory,
  editSubCategory,
  editCategory,
  getAllSubCategories,
  hideSpecificSubCategory,
  createProduct,
  getAllProducts,
  hideSpecificProduct,
  createOffer,
} = require("../controllers/adminsController");

// router.route("/").get();
// router.route("/:id").post();
// users control
router.route("/all-users").get(getAllUsers);
router.route("/forbid-user/:id").put(forbidSpecificUser);
// categories control
router.route("/all-categories").get(getAllCategories);
router.route("/create-category").post(createCategory);
router.route("/hide-category/:id").put(hideSpecificCategory);
router.route("/edit-category/:id").put(editCategory);
// subcategories control
router.route("/all-subcategories").get(getAllSubCategories);
router.route("/create-subcategory").post(createSubCategory);
router.route("/hide-subcategory/:id").put(hideSpecificSubCategory);
router.route("/edit-subcategory/:id").put(editSubCategory);
// brands control
router.route("/all-brands").get(getAllBrands);
router.route("/create-brand").post(createBrand);
router.route("/hide-brand/:id").put(hideSpecificBrand);
router.route("/edit-brand/:id").put(editBrand);
// products control
router.route("/all-products").get(getAllProducts);
router.route("/create-product").post(createProduct);
router.route("/hide-product/:id").put(hideSpecificProduct);
//  offers control
router.route("/create-offer").post(createOffer);
module.exports = router;
