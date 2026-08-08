const jwt = require("jsonwebtoken");

const generateAccessToken = (email) => {
  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const generateRefreshToken = (email) => {
  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
