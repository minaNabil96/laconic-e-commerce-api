// models
const offerModel = require("../models/offerModel");

// helpers
const { arabicFullDate, slugHandler } = require("../helpers/setOfHelpers");
const { isExesistingAndVisible } = require("../helpers/crudHelper");
const ApiError = require("../helpers/apiError");
const FeaturesApi = require("../helpers/featuresApi");

// controllers

exports.getAllOffers = async (req, res, next) => {
	try {
		const documentCount = await offerModel.countDocuments({
			visible: true,
		});
		const query = new FeaturesApi(offerModel.find(), req.query, true)
			.paginate(documentCount)
			.filter()
			.search()
			.fields()
			.sort();

		const { reqQuery, pagination } = query;
		const allOffers = await reqQuery;
		if (allOffers) {
			res.status(200).json({ pagination, allOffers });
		} else {
			return next(new ApiError(`can't find any offer..!`, 404));
		}
	} catch (error) {
		return next(new ApiError(error.message, 400));
	}
};

exports.getSpecificOffer = async (req, res, next) => {
	try {
		const id = req.params.id && req.params.id;

		if (id) {
			const specificOffer = await isExesistingAndVisible(offerModel, id);
			if (specificOffer) {
				res.status(200).json(specificOffer);
			} else
				return next(
					new ApiError(`can't find this offer with id: ${id}`, 404)
				);
		}
	} catch (error) {
		return next(new ApiError(error.message, 400));
	}
};
