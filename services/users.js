const User = require("../models/users.js");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");

async function login({ phoneNumber, password }, callback) {
  const user = await User.findOne({ phoneNumber });

  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(phoneNumber);
      // call toJSON method applied during model instantiation
      return callback(null, { ...user.toJSON(), token });
    } else {
      return callback({
        message: "Invalid User credentials",
      });
    }
  } else {
    return callback({
      message: "Invalid User: Account does not exist!",
    });
  }
}

async function signup(params, callback) {
  if (params.phoneNumber === undefined) {
    console.log(params.phoneNumber);
    return callback(
      {
        message: "Phone Number Required",
      },
      ""
    );
  }

  const user = new User(params);
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function userDetails({ phoneNumber }, callback) {
  const user = await User.findOne({ phoneNumber });

  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(phoneNumber);
      // call toJSON method applied during model instantiation
      return callback(null, { ...user.toJSON(), token });
    } else {
      return callback({
        message: "Invalid User credentials",
      });
    }
  } else {
    return callback({
      message: "Invalid User: Account does not exist!",
    });
  }
}

module.exports = {
  login,
  signup,
  userDetails,
};
