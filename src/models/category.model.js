const { Schema, model, Types } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
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
