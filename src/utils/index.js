const { sign, decode, verify } = require("jsonwebtoken");
const slugify = require("slugify");
const argon = require("argon2");

const signAccessToken = (payload) => {
  return sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });
};

const signRefreshToken = (payload) => {
  return sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: "1y",
  });
};

const verifyAccessToken = (accessToken) => {
  return verify(accessToken, process.env.ACCESS_TOKEN);
};

const verifyRefreshToken = (refreshToken) => {
  return verify(refreshToken, process.env.REFRESH_TOKEN);
};

const decodeAccessToken = (accessToken) => {
  return decode(accessToken, process.env.ACCESS_TOKEN);
};

const toSlug = (text) => {
  return slugify(text, {
    locate: "vi",
    lower: true,
    remove: /.,;':"[]{}!`~=+-=/g,
    replacement: "-",
  });
};

const hashPassword = (password) => {
  return argon.hash(password);
};

const verifyHashedPassword = (password, hashedPassword) => {
  return argon.verify(hashedPassword, password);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeAccessToken,
  toSlug,
  hashPassword,
  verifyHashedPassword,
};
