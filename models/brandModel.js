const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand Name Is Required"],
      unique: [true, "Brand Name Must Be Unique"],
      minlength: [3, "Brand Name Must Be More Than 3 Char"],
      maxlength: [100, "Brand Name Must Be Less Than 100 Char"],
      trim: true,
    },
    slug: {
      type: String,
      lowerCase: true,
    },
    date: {
      type: String,
      default: new Date(),
    },
    visible: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: [true, "Brand Image Is Required"],
    },
  },
  { timestamps: true }
);

const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;
