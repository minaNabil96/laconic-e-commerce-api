const productModel = require("../models/productModel");
const commentModel = require("../models/commentModel");
// end of requiredModels
const { arabicFullDate, slugHandler } = require("../helpers/setOfHelpers");
const { isExesistingAndVisible } = require("../helpers/crudHelper");
const ApiError = require("../helpers/apiError");
const FeaturesApi = require("../helpers/featuresApi");
const { jwtVerification } = require("../helpers/auth");
// end of requiredModels

exports.addRatings = async (req, res, next) => {
	try {
		const token = req.headers.cookie && req.headers.cookie.split("=")[1];
		const { userRateWithComment } = req.body;
		const { productId, userId, userRate, comment } = userRateWithComment;
		const date = await arabicFullDate();
		if (userId && productId && userRate && comment && token) {
			console.log("yes");
			const auth = await jwtVerification(token);
			const avilable = await isExesistingAndVisible(
				productModel,
				productId
			);
			if (avilable && auth) {
				const addedRatingsAndComments = await commentModel.create({
					productId,
					userId,
					userRate,
					comment,
					date,
				});

				if (addedRatingsAndComments) {
					const findRatings = await commentModel.find({
						productId: productId,
						visible: true,
					});
					const ratingsAndComments = findRatings.map(
						(el) => el.userRate
					);

					let totalRatingsSum = 0;
					const numberOfRaters = findRatings.length;

					ratingsAndComments.forEach((el) => {
						totalRatingsSum += el;
					});
					const newRatingsAverage = totalRatingsSum / numberOfRaters;

					const rated = await productModel.findByIdAndUpdate(
						{ _id: productId },
						{
							ratingsQuantity: numberOfRaters,
							ratingsAverage: newRatingsAverage.toFixed(1),
						},
						{ new: true }
					);
					if (rated) {
						res.status(201).json(`added successfully, thank you.`);
					} else {
						return next(
							new ApiError(`sorry,  an error happened `, 404)
						);
					}
				} else {
					return next(
						new ApiError(`we are sorry, an error occureed`, 404)
					);
				}
			} else {
				return next(
					new ApiError(
						`can't find this product with productId: ${productId}`,
						404
					)
				);
			}
		} else {
			return next(new ApiError(`missing dep`, 404));
		}
	} catch (error) {
		return next(new ApiError(error.message, 400));
	}
};

exports.getRatingsAndComments = async (req, res, next) => {
	try {
		const { productId } = req.params;
		if (productId) {
			const existing = await isExesistingAndVisible(
				productModel,
				productId
			);
			if (existing) {
				const documentCount = await commentModel.count({
					productId: productId,
					visible: true,
				});
				// const documentCount =
				// 	commentsDocumentCount.ratingsAndComments.length;
				const query = new FeaturesApi(
					commentModel.find({ productId: productId }).populate({
						path: "userId",
						select: "username arabicname date image",
					}),
					req.query,
					true
				)
					.paginate(documentCount)
					.filter()
					.search()
					.fields()
					.sort();

				const { reqQuery, pagination } = query;
				const ratingsAndComments = await reqQuery;
				res.status(200).json({
					ratingsAndComments,
					pagination,
				});
			} else {
				return next(
					new ApiError(
						`can't find this product with productId: ${productId}`,
						404
					)
				);
			}
		} else {
			return next(new ApiError(`missing dep`, 404));
		}
	} catch (error) {
		return next(new ApiError(error.message, 400));
	}
};
