const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      requierd: [true, "User Name Is Required"],
      unique: [true, "User Name Must be Unique"],
      trim: true,
      minlength: [3, "User Name Must Be More Than 3 Char"],
      maxlength: [30, "User Name Must Be Less Than 30 Char"],
    },
    password: {
      type: String,
      requierd: [true, "Password Is Required"],
      trim: true,
    },
    email: { type: String, requierd: [true, "Email Is Required"] },
    admin: { type: Boolean, default: false },
    date: {
      type: String,
      default: new Date(),
    },
    slug: {
      type: String,
      lowerCase: true,
    },
    image: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    favorites: {
      type: [mongoose.Schema.ObjectId],
      ref: "Product",
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
