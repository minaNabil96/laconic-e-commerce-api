const express = require("express");

const router = express.Router();

const {
	getAllOffers,
	getSpecificOffer,
} = require("../controllers/offersController");

router.route("/").get(getAllOffers);
router.route("/:id").post(getSpecificOffer);

module.exports = router;
