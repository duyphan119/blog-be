const {
  decodeAccessToken,
  saveAccessTokenToCookie,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  saveRefreshTokenToCookie,
} = require("../utils");

const getToken = (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.headers?.authorization?.split("Bearer ")[1];
    let decodedAccessToken = null;
    if (accessToken) {
      decodedAccessToken = decodeAccessToken(accessToken);
    }
    if (!decodedAccessToken || decodedAccessToken.exp < new Date().getTime()) {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        const verifiedRefreshToken = verifyRefreshToken(refreshToken);
        if (verifiedRefreshToken) {
          const { exp, iat, ...payload } = verifiedRefreshToken;
          const newAccessToken = signAccessToken(payload);
          const newRefreshToken = signRefreshToken(payload);
          saveAccessTokenToCookie(newAccessToken, { res });
          saveRefreshTokenToCookie(newRefreshToken, { res });
          res.locals.id = payload.id;
          res.locals.isAuthenticated = true;
          //  new Date().getTime() > exp;
        }
      } else {
        res.locals.isAuthenticated = false;
      }
    }
  } catch (error) {
    console.log(error);
  }
  next();
};
module.exports = {
  getToken,
};
