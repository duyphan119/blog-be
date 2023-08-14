const Blog = require("../models/blog.model");
const Category = require("../models/category.model");

const homePage = async (parent, args, context) => {
  try {
    let mostViewBlogs = [];
    let categories = [];
    let recentBlogs = [];
    let countBlogs = [];

    mostViewBlogs = await Blog.find()
      .sort({ createdAt: "desc", view: "desc" })
      .limit(3);

    categories = await Category.find({ parentId: null });

    recentBlogs = await Blog.find().sort({ createdAt: "desc" }).limit(4);

    for (let i = 0; i < categories.length; i++) {
      const children = await Category.find({ parentId: categories[i]._id });
      let sum = 0;
      const where = [];
      for (let j = 0; j < children.length; j++) {
        const blogs = await Blog.find({
          categoryIds: children[j]._id,
        });
        sum += blogs.length;
        where.push({ categoryIds: children[j]._id });
      }
      const blogs = await Blog.find({ $or: where })
        .limit(3)
        .sort({ createdAt: "desc", view: "desc" });
      countBlogs.push({
        category: categories[i],
        count: sum,
        blogs,
      });
    }

    return {
      mostViewBlogs,
      categories,
      recentBlogs,
      countBlogs,
    };
  } catch (error) {
    throw error;
  }
};

const clientResolver = {
  homePage,
};

module.exports = clientResolver;
