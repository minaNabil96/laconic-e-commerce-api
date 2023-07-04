const mongoose = require("mongoose");

const offerSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "offer name is required"],
			trim: true,
			unique: [true, "user comment must be unique"],
		},
		image: {
			type: String,
			required: [true, "offer image is required"],
		},
		discount: {
			type: Number,
		},
		visible: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const OfferModel = mongoose.model("Offer", offerSchema);

module.exports = OfferModel;
