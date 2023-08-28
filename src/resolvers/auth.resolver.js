const Author = require("../models/author.model");
const {
  verifyHashedPassword,
  signAccessToken,
  hashPassword,
  signRefreshToken,
  verifyRefreshToken,
  saveRefreshTokenToCookie,
  saveAccessTokenToCookie,
} = require("../utils");

const login = async (parent, args, context) => {
  try {
    const {
      loginInput: { email, password },
    } = args;

    const existingAuthor = await Author.findOne({ email });

    if (!existingAuthor) throw new Error("Email is incorrect");

    const result = await verifyHashedPassword(password, existingAuthor.hash);

    if (!result) throw new Error("Password is incorrect");

    const payload = {
      id: existingAuthor._id,
      uid: existingAuthor.uid,
    };

    const accessToken = signAccessToken(payload);

    const refreshToken = signRefreshToken(payload);

    saveAccessTokenToCookie(accessToken, context);

    saveRefreshTokenToCookie(refreshToken, context);

    const { hash, ...author } = existingAuthor._doc;

    return {
      author,
      accessToken,
    };
  } catch (error) {
    throw error;
  }
};

const register = async (parent, args, context) => {
  try {
    const {
      registerInput: { email, password, ...registerInput },
    } = args;

    const existingAuthor = await Author.findOne({ email });

    if (existingAuthor) throw new Error("Email is available");

    const hashedPassword = await hashPassword(password);

    const { hash, ...savedAuthor } = (
      await new Author({
        email,
        hash: hashedPassword,
        ...registerInput,
      }).save()
    )._doc;

    const payload = {
      id: savedAuthor._id,
      uid: savedAuthor.uid,
    };

    const accessToken = signAccessToken(payload);

    const refreshToken = signRefreshToken(payload);

    saveAccessTokenToCookie(accessToken, context);

    saveRefreshTokenToCookie(refreshToken, context);

    return {
      author: savedAuthor,
      accessToken,
    };
  } catch (error) {
    throw error;
  }
};

const profile = async (parent, args, context) => {
  try {
    const { id, isExpired } = context;
    // console.log({ isExpired });

    if (!id) throw new Error("Unauthorized");

    const author = await Author.findById(id);

    return author;
  } catch (error) {
    throw error;
  }
};

const authResolver = {
  Mutation: {
    login,
    register,
  },
  Query: {
    profile,
  },
};

module.exports = authResolver;
