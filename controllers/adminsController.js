require("dotenv").config();
const ApiError = require("../helpers/apiError");

// helpers
const { arabicFullDate, slugHandler } = require("../helpers/setOfHelpers");
const {
  passwordEncryption,
  passwordDcryption,
  jwtAuth,
  jwtVerification,
  jwtAdminVerification,
} = require("../helpers/auth");
const {
  forbidHandler,
  isExesistingAndVisible,
} = require("../helpers/crudHelper");
// models
const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");
const subCategoryModel = require("../models/subCategoryModel");
const brandModel = require("../models/brandModel");
const productModel = require("../models/productModel");
const offerModel = require("../models/offerModel");
// controllers
//  users control
exports.forbidSpecificUser = async (req, res, next) => {
  try {
    const id = req.params.id && req.params.id;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    if (id && token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const checkingUser = await userModel.findById({ _id: id });
        if (checkingUser) {
          const forbidUser = await forbidHandler(userModel, id);
          if (forbidUser) {
            res.status(200).json({
              status: `success ${forbidUser.username} has been forbid from logging`,
            });
          } else {
            return next(
              new ApiError(
                `sorry an error occurred while trying to forbid user, please try again later.`,
                400
              )
            );
          }
        } else {
          return next(new ApiError(`can't find any user with id: ${id}`, 404));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    if (token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const allUsers = await userModel.find();
        if (allUsers) {
          res.status(200).json(allUsers);
        } else {
          return next(new ApiError(`sorry an error occurred`, 404));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};
//  categories control
exports.getAllCategories = async (req, res, next) => {
  try {
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];

    if (token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const allCategories = await categoryModel.find();
        if (allCategories) {
          res.status(200).json(allCategories);
        } else {
          return next(new ApiError(`can't find any categories..!`, 404));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    const date = arabicFullDate();
    const slugSentence = await slugHandler(name);

    if (token && name && slugSentence && image) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const addedCategory = await categoryModel.create({
          name,
          slug: slugSentence,
          image,
          date,
        });

        if (addedCategory) {
          res.status(201).json({ addedCategory, message: "success" });
        } else {
          return next(new ApiError(`sorry an error occurred`, 400));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(new ApiError(`failed due to missing dep`, 400));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.editCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    const slugSentence = name && (await slugHandler(name));
    console.log({ name, image });
    if (token && id) {
      const isAdmin = await jwtAdminVerification(token);
      const avilable = isExesistingAndVisible(categoryModel, id);
      if (isAdmin && avilable) {
        const editedCategory = await categoryModel.findOneAndUpdate(
          { _id: id },
          { name, slug: slugSentence, image },
          { new: true }
        );

        if (editedCategory) {
          res.status(201).json({ editedCategory, message: "success" });
        } else {
          return next(new ApiError(`sorry an error occurred`, 400));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(
          `failed due to missing dep or there's no category with this id: ${id} `,
          400
        )
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.hideSpecificCategory = async (req, res, next) => {
  try {
    const id = req.params.id && req.params.id;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    if (id && token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const checkingCategory = await categoryModel.findById({ _id: id });
        if (checkingCategory) {
          const hideCategory = await forbidHandler(categoryModel, id);
          if (hideCategory) {
            res.status(200).json({
              status: `success ${hideCategory.name} has been hidden`,
            });
          } else {
            return next(
              new ApiError(
                `sorry an error occurred while trying to hide category, please try again later.`,
                400
              )
            );
          }
        } else {
          return next(
            new ApiError(`can't find any category with id: ${id}`, 404)
          );
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

// subcategories control
exports.createSubCategory = async (req, res, next) => {
  try {
    const { name, image, category } = req.body;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    const date = arabicFullDate();
    const slugSentence = await slugHandler(name);
    if (token && name && image && category) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const isAvailable = await isExesistingAndVisible(
          categoryModel,
          category
        );
        if (isAvailable) {
          const newSubCategory = await subCategoryModel.create({
            name,
            slug: slugSentence,
            image,
            date,
            category,
          });
          if (newSubCategory) {
            res.status(201).json({ newSubCategory, message: "success" });
          } else {
            return next(new ApiError(`sorry an error occurred`, 400));
          }
        } else {
          return next(
            new ApiError(`cant find any category with id: ${category}`, 400)
          );
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(new ApiError(`faild due to missing dep`, 400));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.editSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image, category } = req.body;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    const date = arabicFullDate();
    const slugSentence = name && (await slugHandler(name));
    if (token && id) {
      const isAdmin = await jwtAdminVerification(token);
      const isAvailableSub = await isExesistingAndVisible(subCategoryModel, id);
      if (isAdmin && isAvailableSub) {
        if (category) {
          const isAvailable = await isExesistingAndVisible(
            categoryModel,
            category
          );
          if (isAvailable) {
            const editedSubCategory = await subCategoryModel.findOneAndUpdate(
              { _id: id },
              {
                name,
                slug: slugSentence,
                image,
                category,
              },
              { new: true }
            );
            if (editedSubCategory) {
              res.status(201).json({ editedSubCategory, message: "success" });
            } else {
              return next(new ApiError(`sorry an error occurred`, 400));
            }
          }
        } else {
          const editedSubCategory = await subCategoryModel.findOneAndUpdate(
            { _id: id },
            {
              name,
              slug: slugSentence,
              image,
              category,
            },
            { new: true }
          );
          if (editedSubCategory) {
            res.status(201).json({ editedSubCategory, message: "success" });
          } else {
            return next(new ApiError(`sorry an error occurred`, 400));
          }
        }
      } else {
        return next(
          new ApiError(
            `faild due to missing dep or there's no subcategory with this id: ${id}`,
            400
          )
        );
      }
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getAllSubCategories = async (req, res, next) => {
  try {
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];

    if (token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const allSubCategories = await subCategoryModel
          .find()
          .populate({ path: "category" });
        if (allSubCategories) {
          res.status(200).json(allSubCategories);
        } else {
          return next(new ApiError(`can't find any categories..!`, 404));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.hideSpecificSubCategory = async (req, res, next) => {
  try {
    const id = req.params.id && req.params.id;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    console.log({ id, token });
    if (id && token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const checkingSubCategory = await subCategoryModel.findById({
          _id: id,
        });
        if (checkingSubCategory) {
          const hideSubCategory = await forbidHandler(subCategoryModel, id);
          if (hideSubCategory) {
            res.status(200).json({
              status: `success ${hideSubCategory.name} has been hidden`,
            });
          } else {
            return next(
              new ApiError(
                `sorry an error occurred while trying to hide subcategory, please try again later.`,
                400
              )
            );
          }
        } else {
          return next(
            new ApiError(`can't find any subcategory with id: ${id}`, 404)
          );
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

// brands control
exports.getAllBrands = async (req, res, next) => {
  try {
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];

    if (token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const allBrands = await brandModel.find();
        if (allBrands) {
          res.status(200).json(allBrands);
        } else {
          return next(new ApiError(`can't find any brands..!`, 404));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.createBrand = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    const date = arabicFullDate();
    const slugSentence = await slugHandler(name);
    if (token && name && slugSentence && image) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const addedBrand = await brandModel.create({
          name,
          slug: slugSentence,
          image,
          date,
        });

        if (addedBrand) {
          res.status(201).json({ addedBrand, message: "success" });
        } else {
          return next(new ApiError(`sorry an error occurred`, 400));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(new ApiError(`failed due to missing dep`, 400));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.editBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    const date = arabicFullDate();
    const slugSentence = name && (await slugHandler(name));
    if (token && id) {
      const isAdmin = await jwtAdminVerification(token);
      const avilable = await isExesistingAndVisible(brandModel, id);
      if (avilable && isAdmin) {
        const editedBrand = await brandModel.findOneAndUpdate(
          { _id: id },
          {
            name,
            slug: slugSentence,
            image,
          },
          { new: true }
        );

        if (editedBrand) {
          res.status(201).json({ editedBrand, message: "success" });
        } else {
          return next(new ApiError(`sorry an error occurred`, 400));
        }
      } else {
        return next(
          new ApiError(`can't find any brand with this id: ${id}`, 400)
        );
      }
    } else {
      return next(new ApiError(`failed due to missing dep`, 400));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.hideSpecificBrand = async (req, res, next) => {
  try {
    const id = req.params.id && req.params.id;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    if (id && token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const checkingBrand = await brandModel.findById({ _id: id });
        if (checkingBrand) {
          const hideBrand = await forbidHandler(brandModel, id);
          if (hideBrand) {
            res.status(200).json({
              status: `success ${hideBrand.name} has been hidden`,
            });
          } else {
            return next(
              new ApiError(
                `sorry an error occurred while trying to hide brand, please try again later.`,
                400
              )
            );
          }
        } else {
          return next(new ApiError(`can't find any brand with id: ${id}`, 404));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

// products control
exports.createProduct = async (req, res, next) => {
  try {
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    // need to calculate 1- priceAfterDiscount  2- sold 3- ratingsAverage 4- ratingsQuantity
    const {
      name,
      desc,
      quantity,
      price,
      priceAfterDiscount,
      avilableVerions,
      coverImage,
      details,
      images,
      category,
      subCategory,
      brand,
      offer,
    } = req.body;
    const date = arabicFullDate();
    const slugSentence = await slugHandler(name);
    if (token && name && desc && quantity && price && coverImage && category) {
      const isAdmin = await jwtAdminVerification(token);
      const isAvilableCategory = await isExesistingAndVisible(
        categoryModel,
        category
      );
      if (isAdmin) {
        const avilableOffer =
          offer && (await isExesistingAndVisible(offerModel, offer));
        const percentageCalc =
          offer && (price * Number(avilableOffer.discount)) / 100;
        const priceWithDiscount = offer && price - percentageCalc;
        if (isAvilableCategory) {
          const createdProduct = await productModel.create({
            name,
            slug: slugSentence,
            details,
            date,
            desc,
            quantity,
            price,
            avilableVerions,
            coverImage,
            images,
            category,
            subCategory,
            brand,
            priceAfterDiscount: priceWithDiscount,
            offer,
          });

          if (createdProduct) {
            // .save();
            res.status(201).json({ createdProduct, message: "success" });
          } else {
            return next(new ApiError(`sorry an error occurred`, 400));
          }
        } else {
          return next(
            new ApiError(`can't find any category with id: ${category}`, 400)
          );
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(new ApiError(`failed due to missing dep`, 400));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];

    if (token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const allProducts = await productModel.find().populate([
          { path: "category", select: "name" },
          { path: "brand", select: "name" },
          { path: "subCategory", select: "name" },
        ]);
        if (allProducts) {
          res.status(200).json(allProducts);
        } else {
          return next(new ApiError(`can't find any products..!`, 404));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.hideSpecificProduct = async (req, res, next) => {
  try {
    const id = req.params.id && req.params.id;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    if (id && token) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const checkingProduct = await productModel.findById({ _id: id });
        if (checkingProduct) {
          const hideProduct = await forbidHandler(productModel, id);
          if (hideProduct) {
            res.status(200).json({
              status: `success ${hideProduct.name} has been hidden`,
            });
          } else {
            return next(
              new ApiError(
                `sorry an error occurred while trying to hide product, please try again later.`,
                400
              )
            );
          }
        } else {
          return next(
            new ApiError(`can't find any product with id: ${id}`, 404)
          );
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(
        new ApiError(`unauthenticated there's no token received`, 401)
      );
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.createOffer = async (req, res, next) => {
  try {
    const { name, image, discount } = req.body;
    console.log(req.body);
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    const date = arabicFullDate();
    const slugSentence = await slugHandler(name);
    if (token && name && slugSentence && image) {
      const isAdmin = await jwtAdminVerification(token);
      if (isAdmin) {
        const addedOffer = await offerModel.create({
          name,
          slug: slugSentence,
          image,
          discount,
          date,
        });

        if (addedOffer) {
          res.status(201).json({ addedOffer, message: "success" });
        } else {
          return next(new ApiError(`sorry an error occurred`, 400));
        }
      } else {
        return next(new ApiError(`unauthenticated you are not admin !!`, 401));
      }
    } else {
      return next(new ApiError(`failed due to missing dep`, 400));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};
