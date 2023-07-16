require("dotenv").config();
const ApiError = require("../helpers/apiError");
// models
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

// helpers
const { arabicFullDate, slugHandler } = require("../helpers/setOfHelpers");
const {
  passwordEncryption,
  passwordDcryption,
  jwtAuth,
  jwtVerification,
  jwtConfirmEmail,
  emailConfirmation,
  jwtSignUpVerifivation,
  jwtFullVerification,
} = require("../helpers/auth");
const {
  isExesistingAndVisible,
  isAvilableUser,
} = require("../helpers/crudHelper");

// controllers
exports.signup = async (req, res, next) => {
  try {
    const { image, admin } = req.body;
    const username = req.body.username && req.body.username.trim();
    const password = req.body.password && req.body.password.trim();
    const email = req.body.email && req.body.email.trim();
    const date = arabicFullDate();
    if (username && password) {
      const encryptPassword = await passwordEncryption(password);
      const slugSentence = slugHandler(username);
      const userMatch = await userModel.findOne({
        username: { $eq: username },
      });
      console.log(userMatch);
      //  new user
      if (!userMatch && encryptPassword && slugSentence) {
        if (email.includes("gmail") || email.includes("yahoo")) {
          const confirmationToken = await jwtConfirmEmail(username, email);

          const confirmation = await emailConfirmation(
            email,
            "Email Confirmation",
            `${process.env.ALLOWED_URL}/users/email-confirmation/Bearer-${confirmationToken}`
          );
          if (
            confirmationToken &&
            confirmation &&
            confirmation.includes("OK")
          ) {
            const newUser = await userModel.create({
              username,
              password: encryptPassword,
              email,
              slug: slugSentence,
              image,
              date,
            });
            if (newUser) {
              res.status(201).json({
                status: "congratulation",
                newuser: { username, email, date, slug: slugSentence },
                confirmationEmail: "sent successfully",
              });
            } else {
              return next(
                new ApiError(
                  `an error occurred while trying to create new user, please try again later.`,
                  400
                )
              );
            }
          } else {
            return next(
              new ApiError(
                `an error occurred while trying to create new user, please try again later.`,
                400
              )
            );
          }
        } else {
          return next(new ApiError(`this email is not supported `, 400));
        }
      }
      // user has signd up before
      else if (userMatch) {
        if (userMatch.confirmed === false) {
          const deleteUser = await userModel.findOneAndDelete({
            username: { $eq: username },
          });

          return res.status(405).json({ status: `please try again` });
        }
        return res
          .status(405)
          .json({ status: `${userMatch.username} has already registered` });
      }
    } else if (!username || !password || !email) {
      res.status(400).json({
        status: "failed due to missing username or password or email !",
      });
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.signupConfirm = async (req, res, next) => {
  try {
    const token = req.body.token && req.body.token.trim();
    const password = req.body.password && req.body.password.trim();
    const username = req.body.username && req.body.username.trim();
    if (username && password && token) {
      const confirmedUserData = await jwtSignUpVerifivation(token);
      if (confirmedUserData && confirmedUserData.userObj === username) {
        const matchedUser = await userModel.find({ username: username });
        const confirmedUser = await userModel.findOneAndUpdate(
          { _id: matchedUser[0]._id },
          { confirmed: true },
          { new: true }
        );
        if (matchedUser.length > 0 && matchedUser[0].visible === true) {
          const [
            {
              _id: userId,
              password: passFromdDb,
              username: userNameFromDb,
              image,
              admin,
            },
          ] = matchedUser && matchedUser;
          const decryptAndComparePassword = await passwordDcryption(
            password,
            passFromdDb
          );
          if (decryptAndComparePassword === true && confirmedUser) {
            const generatedTokens = await jwtAuth(matchedUser);

            if (generatedTokens.accessToken && generatedTokens.refreshToken) {
              return res
                .status(200)
                .cookie("token", `${generatedTokens.refreshToken}`, {
                  secure: true,
                  httpOnly: true,
                  sameSite: "none",
                })
                .json({
                  isLoggedIn: true,
                  username: userNameFromDb,
                  userId,
                  image,
                  admin: admin,
                  accessToken: `Bearer ${generatedTokens.accessToken}`,
                });
            }
            return next(
              new ApiError(
                `an error occurred while trying to login, please try again later.`,
                401
              )
            );

            // res.status(200).json({ status: success });
          }
          return next(new ApiError(`wrong password`, 401));
        }
        return next(
          new ApiError(`wrong username, ${username} isn't registered.`, 401)
        );
      }
      return next(new ApiError(`sorry an error happend`, 403));
    }
    return next(new ApiError(`faild due to missing dep`, 405));
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    const password = req.body.password && req.body.password.trim();
    const username = req.body.username && req.body.username.trim();
    if (username && password) {
      const matchedUser = await userModel.find({ username: username });
      if (
        matchedUser.length > 0 &&
        matchedUser[0].visible === true &&
        matchedUser[0].confirmed === true
      ) {
        const [
          {
            _id: userId,
            password: passFromdDb,
            username: userNameFromDb,
            image,
            admin,
          },
        ] = matchedUser && matchedUser;
        const decryptAndComparePassword = await passwordDcryption(
          password,
          passFromdDb
        );
        if (decryptAndComparePassword === true) {
          const generatedTokens = await jwtAuth(matchedUser);

          if (generatedTokens.accessToken && generatedTokens.refreshToken) {
            return res
              .status(200)
              .cookie("token", `${generatedTokens.refreshToken}`, {
                secure: true,
                httpOnly: true,
                sameSite: "none",
              })
              .json({
                isLoggedIn: true,
                username: userNameFromDb,
                userId,
                image,
                admin: admin,
                accessToken: `Bearer ${generatedTokens.accessToken}`,
              });
          }
          return next(
            new ApiError(
              `an error occurred while trying to login, please try again later.`,
              401
            )
          );

          // res.status(200).json({ status: success });
        }
        return next(new ApiError(`wrong password`, 401));
      }
      return next(
        new ApiError(`wrong username, ${username} isn't registered.`, 401)
      );
    }
    return next(new ApiError(`faild due to missing dep`, 400));
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ status: "success" });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email.trim();
    const username = req.body.username.trim();
    console.log({ email, username });
    if (email && username) {
      const findUser = await isAvilableUser(userModel, username, email);
      console.log(findUser);
      if (findUser) {
        const confirmationToken = await jwtConfirmEmail(username, email);

        const passwordReset = await emailConfirmation(
          email,
          "Reset Password",
          `${process.env.ALLOWED_URL}/users/reset-password/Bearer-${confirmationToken}`
        );
        if (passwordReset && passwordReset.includes("OK")) {
          res.status(200).json({
            status:
              "we have sent you an email with a link to reset your password ",
          });
        } else {
          return next(
            new ApiError(`sorry an error occurred please try again later.`, 400)
          );
        }
      } else {
        return next(
          new ApiError(
            `there's no user with username: ${username} or maybe the email: ${email} is wrong`,
            400
          )
        );
      }
    } else {
      return next(new ApiError(`faild due to missing dep`, 400));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.editPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    console.log({ token, newPassword });
    if (token && newPassword) {
      const confirmedUserData = await jwtSignUpVerifivation(token);
      console.log(confirmedUserData);
      if (confirmedUserData && confirmedUserData.userObj) {
        const user = await userModel.findOne({
          username: confirmedUserData.userObj,
        });
        const encryptPassword = await passwordEncryption(newPassword);

        if (user && encryptPassword) {
          const editedUser = await userModel
            .findOneAndUpdate(
              { username: user.username },
              { password: encryptPassword },
              { new: true }
            )
            .select("-password -favorites -date");
          if (editedUser) {
            res
              .status(201)
              .json({ status: "success password has been reset", editedUser });
          }
        } else {
          return next(new ApiError(`sorry an error occurred`, 400));
        }
      } else {
        return next(
          new ApiError(`sorry an error occurred please try again later.`, 400)
        );
      }
    } else {
      return next(new ApiError(`faild due to missing dep`, 400));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getVisibleUsers = async (req, res, next) => {
  try {
    const allUsers = await userModel
      .find({ visible: true })
      .select("-password");
    if (allUsers) {
      res.status(200).json(allUsers);
    } else {
      return next(new ApiError(`can't find any users..!`, 404));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.getSpecificUser = async (req, res, next) => {
  try {
    const id = req.params.id && req.params.id;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    if (token) {
      if (!id) {
        return next(new ApiError(`missing id!!`, 404));
      }
      const verifiedUser = await jwtVerification(token);
      const isAvailable = await isExesistingAndVisible(userModel, id);
      if (verifiedUser && isAvailable) {
        // const verifiedId = verifiedUser && verifiedUser[0]._id;
        const specificUser = await userModel
          .findById({ _id: id })
          .select("-password")
          .populate({ path: "favorites", select: "name coverImage" });
        if (specificUser) {
          res.status(200).json(specificUser);
        } else {
          return next(new ApiError(`can't find any user with id: ${id}`, 404));
        }
      } else {
        return next(
          new ApiError(`authentication error, user with id: ${id}`, 404)
        );
      }
    } else {
      return next(new ApiError(`unauthenticated`, 401));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.addFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    const { productId } = req.body;
    if (token && id && productId) {
      const avilablePeoduct = await isExesistingAndVisible(
        productModel,
        productId
      );
      const user = await jwtFullVerification(token, id);
      if (user && avilablePeoduct) {
        const findUser = await userModel.findOne({
          _id: id,
          favorites: { $in: [productId] },
        });

        if (!findUser || findUser.length === 0) {
          const favoritesArray = await userModel
            .findOne({ _id: id })
            .select("-_id favorites");

          if (favoritesArray && favoritesArray.favorites.length < 6) {
            const added = await userModel
              .findOneAndUpdate(
                { _id: id },
                { $push: { favorites: productId } },
                { new: true }
              )
              .select("favorites");
            if (added) {
              res.status(201).json({ status: "success", added });
            } else {
              next(new ApiError(`sorry an error occurred.`), 400);
            }
          } else {
            return next(
              new ApiError(`favorites can't be more than 6 items`),
              400
            );
          }
        } else {
          return next(
            new ApiError(
              `this product with this id: ${productId} is already in the favorites`
            ),
            400
          );
        }
        // const addFavorites =
      } else
        return next(
          new ApiError(`can't find any product with this id: ${productId}`),
          400
        );
    } else {
      return next(new ApiError(`unauthenticated!`, 401));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.deleteFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];
    const { productId } = req.body;
    if (token && id && productId) {
      const avilablePeoduct = await isExesistingAndVisible(
        productModel,
        productId
      );
      const user = await jwtFullVerification(token, id);

      if (user && avilablePeoduct) {
        const findUser = await userModel.findOne({
          _id: id,
          favorites: { $in: [productId] },
        });
        if (findUser || findUser.length > 0) {
          const editedFavorites = await userModel.findOneAndUpdate(
            { _id: id },
            { $pull: { favorites: productId } },
            { new: true }
          );
          if (editedFavorites) {
            res.status(201).json({ status: "success", editedFavorites });
          } else {
            return next(new ApiError(`sorry an error occurred`), 400);
          }
        } else {
          return next(new ApiError(`product isn't in your favorites`), 400);
        }
      } else {
        return next(
          new ApiError(`can't find any product with this id: ${productId}`),
          400
        );
      }
    } else {
      return next(new ApiError(`unauthenticated!`, 401));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.contactme = async (req, res, next) => {
  try {
    const { name, phone, email, message } = req.body;
    if (name && phone && email && message) {
      const confirmation = await emailConfirmation(
        `${process.env.EMAIL_FOR_NODEMAILER}`,
        "message from e-commerce sample",
        `name: ${name}. 
         sender-email: ${email}.
         phone: ${phone}.
         message: ${message}.`
      );
      if (confirmation && confirmation.includes("OK")) {
        res.status(200).json({ status: "success" });
      } else {
        return next(new ApiError(`failed`));
      }
    } else {
      return next(new ApiError(`sorry an error occureed`));
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

exports.refreshServer = async (req, res, next) => {
  try {
    res.status(200).json({ status: "ready" });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};
