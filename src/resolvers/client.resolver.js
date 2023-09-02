const Blog = require("../models/blog.model");
const Category = require("../models/category.model");
const Reply = require("../models/reply.model");
const fetch = require("node-fetch");
const { handleDate } = require("../utils");

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

const dashboardPage = async (parent, args, context) => {
  try {
    const DEFAULT_LIMIT = 5;
    const DEFAULT_SORT = { createdAt: "desc" };
    const DEFAULT_WHERE = { deletedAt: null };

    const { monthStr, lastMonthStr, lastDate, lastDateLastMonth, year } =
      handleDate();

    const [
      recentBlogs,
      mostViewBlogs,
      currentMonthCountBlog,
      previousMonthCountBlog,
      currentMonthCountReply,
      previousMonthCountReply,
    ] = await Promise.all([
      Blog.find(DEFAULT_WHERE).limit(DEFAULT_LIMIT).sort(DEFAULT_SORT),
      Blog.find(DEFAULT_WHERE)
        .limit(DEFAULT_LIMIT)
        .sort({ ...DEFAULT_SORT, view: "desc" }),
      Blog.count({
        ...DEFAULT_WHERE,
        createdAt: {
          $gte: new Date(`${year}-${monthStr}-01T00:00:00.000Z`),
          $lte: new Date(`${year}-${monthStr}-${lastDate}T23:59:59.999Z`),
        },
      }),
      Blog.count({
        ...DEFAULT_WHERE,
        createdAt: {
          $gte: new Date(`${year}-${lastMonthStr}-01T00:00:00.000Z`),
          $lte: new Date(
            `${year}-${lastMonthStr}-${lastDateLastMonth}T23:59:59.999Z`
          ),
        },
      }),
      Reply.count({
        ...DEFAULT_WHERE,
        createdAt: {
          $gte: new Date(`${year}-${monthStr}-01T00:00:00.000Z`),
          $lte: new Date(`${year}-${monthStr}-${lastDate}T23:59:59.999Z`),
        },
      }),
      Reply.count({
        ...DEFAULT_WHERE,
        createdAt: {
          $gte: new Date(`${year}-${lastMonthStr}-01T00:00:00.000Z`),
          $lte: new Date(
            `${year}-${lastMonthStr}-${lastDateLastMonth}T23:59:59.999Z`
          ),
        },
      }),
    ]);

    return {
      recentBlogs,
      mostViewBlogs,
      currentMonthCountBlog,
      previousMonthCountBlog,
      previousMonthCountReply,
      currentMonthCountReply,
    };
  } catch (error) {
    throw error;
  }
};

const githubFollowers = async (parent, args, context) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${process.env.GITHUB}/followers`
    );
    const result = await response.json();
    return result.length;
  } catch (error) {
    return 0;
  }
};

const youtubeSubscribers = async (parent, args, context) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${process.env.CHANNEL_YTB}&key=AIzaSyBkkPtA73cb7WROgy_BfsbqPL6-4PdxJkg`
    );
    const result = await response.json();
    return result?.items[0]?.statistics?.subscriberCount || 0;
  } catch (error) {}
  return 0;
};

const clientResolver = {
  Query: {
    homePage,
    dashboardPage,
    githubFollowers,
    youtubeSubscribers,
  },
};

module.exports = clientResolver;
