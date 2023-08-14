const { GraphQLScalarType } = require("graphql");
const authResolver = require("./auth.resolver");
const blogResolver = require("./blog.resolver");
const categoryResolver = require("./category.resolver");
const clientResolver = require("./client.resolver");
const replyResolver = require("./reply.resolver");
const subscriberResolver = require("./subscriber.resolver");

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
  }),
  Query: {
    profile: authResolver.profile,
    categories: categoryResolver.categories,
    rootCategories: categoryResolver.rootCategories,
    category: categoryResolver.category,
    deletedCategories: categoryResolver.deletedCategories,
    blogs: blogResolver.blogs,
    blog: blogResolver.blog,
    deletedBlogs: blogResolver.deletedBlogs,
    homePage: clientResolver.homePage,
    replies: replyResolver.replies,
  },
  Category: {
    parent: categoryResolver.parent,
    children: categoryResolver.children,
  },
  Blog: {
    author: blogResolver.author,
    categories: blogResolver.categories,
  },
  Reply: {
    blog: replyResolver.blog,
  },
  Mutation: {
    login: authResolver.login,
    register: authResolver.register,
    createCategory: categoryResolver.createCategory,
    updateCategory: categoryResolver.updateCategory,
    deleteCategories: categoryResolver.deleteCategories,
    restoreCategories: categoryResolver.restoreCategories,
    softDeleteCategories: categoryResolver.softDeleteCategories,
    createBlog: blogResolver.createBlog,
    updateBlog: blogResolver.updateBlog,
    deleteBlogs: blogResolver.deleteBlogs,
    restoreBlogs: blogResolver.restoreBlogs,
    softDeleteBlogs: blogResolver.softDeleteBlogs,
    createReply: replyResolver.createReply,
    createSubscriber: subscriberResolver.createSubscriber,
  },
};

module.exports = resolvers;
