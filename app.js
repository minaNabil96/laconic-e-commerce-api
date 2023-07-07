const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cookie = require("cookie");
const ApiError = require("./helpers/apiError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const adminsRouter = require("./routes/admins");
const categoriesRouter = require("./routes/categories");
const subCategoriesRouter = require("./routes/subcategories");
const brandsRouter = require("./routes/brands");
const productsRouter = require("./routes/products");
const commentsRouter = require("./routes/comments");
const offersRouter = require("./routes/offers");

const app = express();
// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");
app.use(
  cors({
    credentials: true,
    origin: [
      // "http://localhost:3000",
      // process.env.ALLOWED_URL,
      "https://laconic-e-commerce-sample.vercel.app/",
      "https://laconic-e-commerce-sample.vercel.app",
      "https://laconic-e-commerce-sample-minanabil96.vercel.app/",
      "https://laconic-e-commerce-sample-minanabil96.vercel.app",
      "https://laconic-e-commerce-sample-git-main-minanabil96.vercel.app/",
      "https://laconic-e-commerce-sample-git-main-minanabil96.vercel.app",
      "https://laconic-e-commerce-sample-cct0r1pms-minanabil96.vercel.app",
      "https://laconic-e-commerce-sample-cct0r1pms-minanabil96.vercel.app/",
      "https://laconic-e-commerce-sample-api.cyclic.app/",
      "https://laconic-e-commerce-sample-api.cyclic.app",
      "*",
    ],
    allowedHeaders: [
      "content-type",
      "access-control-allow-origin",
      "access-control-allow-credentials",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Methods",
      "Set-Cookie",
    ],
  })
);
app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admins", adminsRouter);
app.use("/categories", categoriesRouter);
app.use("/subcategories", subCategoriesRouter);
app.use("/brands", brandsRouter);
app.use("/products", productsRouter);
app.use("/comments", commentsRouter);
app.use("/offers", offersRouter);
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// handling unhandled routes
app.all("*", (req, res, next) => {
  const err = new ApiError(`Can't find this route: ${req.originalUrl}`, 400);

  next(err);
});

// error handler
app.use(globalErrorHandler);

module.exports = app;
