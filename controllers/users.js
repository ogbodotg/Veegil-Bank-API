const bcrypt = require("bcryptjs");
const userServices = require("../services/users.js");
const User = require("../models/users.js");

// create new account
exports.signup = (req, res, next) => {
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(10);

  req.body.password = bcrypt.hashSync(password, salt);

  userServices.signup(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Account Created Successfully",
      data: results,
    });
  });
};

// login user account
exports.login = (req, res, next) => {
  const { phoneNumber, password } = req.body;

  userServices.login({ phoneNumber, password }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "User logged in successfully",
      data: results,
    });
  });
};

exports.get_users = async function (req, res) {
  const users = await User.find({});
  res.status(200).json({ users });
};

exports.userProfile = async (req, res, next) => {
  const users = await User.find({ phoneNumber: req.params.phoneNumber });
  return res.status(401).json({ message: "Authorized User!!", data: users });
};
