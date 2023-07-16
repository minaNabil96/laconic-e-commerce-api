const express = require("express");

const router = express.Router();
const {
  signup,
  getVisibleUsers,
  login,
  getSpecificUser,
  logout,
  signupConfirm,
  addFavorites,
  deleteFavorites,
  contactme,
  forgotPassword,
  editPassword,
  refreshServer,
} = require("../controllers/usersController");
/* GET users listing. */
router.route("/refresh").get(refreshServer);
router.route("/").get(getVisibleUsers);
router.route("/signup").post(signup);
router.route("/signup/confirmation").post(signupConfirm);
router.route("/reset-password").post(forgotPassword);
router.route("/edit-password").post(editPassword);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/:id").post(getSpecificUser);
router.route("/add-favorites/:id").post(addFavorites);
router.route("/delete-favorites/:id").put(deleteFavorites);
router.route("/contact-me").put(contactme);
module.exports = router;
