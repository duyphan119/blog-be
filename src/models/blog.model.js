const { Schema, model, Types } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    slug: {
      type: String,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    authorId: {
      type: Types.ObjectId,
      ref: "Author",
    },
    categoryIds: [
      {
        type: Types.ObjectId,
        ref: "Category",
      },
    ],
    view: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Blog = model("Blog", blogSchema);

module.exports = Blog;
