const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRETKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(phoneNumber) {
  return jwt.sign({ data: phoneNumber }, process.env.JWT_SECRETKey, {
    expiresIn: process.env.JWT_LIFETIME,
  });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
