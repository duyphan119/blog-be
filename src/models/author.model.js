const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    uid: {
      type: String,
    },
    email: {
      type: String,
    },
    hash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Author = model("Author", authorSchema);

module.exports = Author;
