require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.passwordEncryption = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

exports.passwordDcryption = async (password, passFromdDb) => {
  const decryptAndComparePassword = await bcrypt.compare(password, passFromdDb);
  return decryptAndComparePassword;
};

exports.jwtConfirmEmail = async (userObj) => {
  const emailConfirmationToken = await jwt.sign(
    { userObj },
    process.env.EMAILCONFIRM_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  if (emailConfirmationToken) {
    return emailConfirmationToken;
  }
  return null;
};

exports.jwtAuth = async (matchedUser) => {
  const userObjForTokens = { ...matchedUser };
  delete userObjForTokens.password;
  const accessToken = await jwt.sign(
    userObjForTokens,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "60s",
    }
  );
  const refreshToken = await jwt.sign(
    userObjForTokens,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
};

exports.jwtVerification = async (token) => {
  const verifying = await jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return null;
      }
      return user;
    }
  );
  return verifying;
};

exports.jwtFullVerification = async (token, id) => {
  const verifying = await jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return null;
      }
      return user;
    }
  );

  if (verifying && verifying[0]._id === id) {
    return verifying;
  }
  return null;
};

exports.jwtSignUpVerifivation = async (token) => {
  const verifying = await jwt.verify(
    token,
    process.env.EMAILCONFIRM_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return null;
      }
      return user;
    }
  );
  return verifying;
};

exports.jwtAdminVerification = async (token) => {
  const verifying = await jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return null;
      }
      if (user[0].admin === true) {
        return true;
      }
      return false;
    }
  );
  return verifying;
};

exports.emailConfirmation = async (email, subject, htmlTamplate) => {
  try {
    const transporterGmail = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL_FOR_NODEMAILER}`,
        pass: `${process.env.APP_PASSWORD_FOR_NODEMAILER}`,
      },
    });
    // const transporterYahoo = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: `${process.env.EMAIL_FOR_NODEMAILER}`,
    //     pass: `${process.env.APP_PASSWORD_FOR_NODEMAILER}`,
    //   },
    // });

    const mailOptions = {
      from: `${process.env.EMAIL_FOR_NODEMAILER}`,
      to: email,
      subject: subject,
      html: htmlTamplate,
    };

    const info = await transporterGmail.sendMail(mailOptions);
    // console.log(`email sent: ${info.response}`);
    return info.response;

    // if (email.includes("yahoo")) {
    //   const info = await transporterYahoo.sendMail(mailOptions);
    //   console.log(`email sent: ${info.response}`);
    //   return info.response;
    // }
  } catch (error) {
    console.log(error);
    return null;
  }
};
