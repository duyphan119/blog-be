const { Schema, model, Types } = require("mongoose");

const replySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Reply = model("Reply", replySchema);

module.exports = Reply;
