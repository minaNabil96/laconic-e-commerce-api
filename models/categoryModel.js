const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Is Required"],
      unique: [true, "Category Name Must Be Unique"],
      minlength: [3, "Category Name Must Be More Than 3 Char"],
      maxlength: [100, "Category Name Must Be Less Than 100 Char"],
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
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
