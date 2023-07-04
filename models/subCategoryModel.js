const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory Name Is Required"],
      unique: [true, "Subcategory Name Must Be Unique"],
      minlength: [3, "Subcategory Name Must Be More Than 3 Char"],
      maxlength: [100, "Subcategory Name Must Be Less Than 100 Char"],
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
      required: [true, "Subcategory Image Is Required"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "category Id Is Required"],
    },
  },
  { timestamps: true }
);

const SubcategoryModel = mongoose.model("Subcategory", subCategorySchema);

module.exports = SubcategoryModel;
