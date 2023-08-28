const { Schema, model, Types } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    parentId: {
      type: Types.ObjectId,
      ref: "Category",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const Category = model("Category", categorySchema);

module.exports = Category;
