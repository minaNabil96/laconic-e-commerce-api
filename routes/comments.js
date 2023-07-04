const express = require("express");

const router = express.Router();

const {
	addRatings,
	getRatingsAndComments,
} = require("../controllers/commentsController");

router.route("/addrateandcomment").post(addRatings);
router.route("/getratingsandcomment/:productId").post(getRatingsAndComments);

module.exports = router;
