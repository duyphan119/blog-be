const { sign, decode, verify } = require("jsonwebtoken");
const slugify = require("slugify");
const argon = require("argon2");

const signAccessToken = (payload) =>
  sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "3s",
  });

const signRefreshToken = (payload) =>
  sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: "1y",
  });

const verifyAccessToken = (accessToken) =>
  verify(accessToken, process.env.ACCESS_TOKEN);

const verifyRefreshToken = (refreshToken) =>
  verify(refreshToken, process.env.REFRESH_TOKEN);

const decodeAccessToken = (accessToken) =>
  decode(accessToken, process.env.ACCESS_TOKEN);

const toSlug = (text) =>
  slugify(text, {
    locale: "vi",
    lower: true,
    removeDiacritics: true,
    replacement: "-",
  });

const hashPassword = (password) => argon.hash(password);

const verifyHashedPassword = (password, hashedPassword) =>
  argon.verify(hashedPassword, password);

const saveAccessTokenToCookie = (accessToken, context) => {
  context.res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 6 * 1000,
    sameSite: "lax",
    secure: false,
  });
};

const saveRefreshTokenToCookie = (refreshToken, context) => {
  context.res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false,
  });
};

const handleDate = (inputDate) => {
  let dateObj = new Date();

  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  const date = dateObj.getDate();
  const lastDate = new Date(year, month, 0).getDate();
  const lastMonth = month === 1 ? 12 : month - 1;
  const lastYear = year - 1;
  const lastDateLastMonth = new Date(year, lastMonth, 0).getDate();
  const monthStr = `${month < 10 ? "0" : ""}${month}`;
  const lastMonthStr = `${lastMonth < 10 ? "0" : ""}${lastMonth}`;

  return {
    month,
    year,
    date,
    lastDate,
    lastMonth,
    lastYear,
    lastDateLastMonth,
    monthStr,
    lastMonthStr,
  };
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
  saveRefreshTokenToCookie,
  saveAccessTokenToCookie,
  handleDate,
};
