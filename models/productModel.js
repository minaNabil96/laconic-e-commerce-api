const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name Is Required"],
      unique: [true, "Product Name Must Be Unique"],
      minlength: [3, "Product Name Must Be More Than 3 Char"],
      maxlength: [200, "Product Name Must Be Less Than 200 Char"],
      trim: true,
    },
    slug: {
      type: String,
      lowerCase: true,
    },
    desc: {
      type: String,
      required: [true, "Product Description Is Required"],
    },
    details: {
      type: [Object],
      required: [true, "Product Details Is Required"],
    },
    quantity: {
      type: Number,
      required: [true, "Product Quantity Is Required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product Price Is Required"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
    },
    sold: { type: Number, default: 0 },
    avilableVerions: {
      type: [String],
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
      default: 1,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      required: [true, "Product Cover Image Is Required"],
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Category Id Is Required"],
    },
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    offer: {
      type: mongoose.Schema.ObjectId,
      ref: "Offer",
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

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
