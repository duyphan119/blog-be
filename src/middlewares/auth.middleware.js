const { decodeAccessToken } = require("../utils");

const getToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const [_, token] = authorization.split("Bearer ");

      const decodedToken = decodeAccessToken(token);

      if (decodedToken) {
        res.locals.id = decodedToken.id;
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
