const jwt = require("jsonwebtoken");

generateToken = function (userId) {
  return jwt.sign({ userId: userId }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

module.exports = generateToken;
