const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: "Users",
			required: [true, "user id is required"],
		},
		productId: {
			type: mongoose.Schema.ObjectId,
			ref: "Product",
			required: [true, "product id is required"],
		},
		userRate: {
			type: Number,
			required: [true, "user rate is required"],
		},
		comment: {
			type: String,
			required: [true, "user comment is required"],
			trim: true,
			unique: [true, "user comment must be unique"],
		},
		date: {
			type: String,
			default: new Date(),
		},
		visible: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const CommentModel = mongoose.model("Comment", commentSchema);
module.exports = CommentModel;
