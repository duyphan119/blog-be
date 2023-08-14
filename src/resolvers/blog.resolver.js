const Blog = require("../models/blog.model");
const Author = require("../models/author.model");
const { toSlug } = require("../utils");
const Category = require("../models/category.model");
// const { transporter } = require("../config/nodemailer");
const Subscriber = require("../models/subscriber.model");
const nodemailer = require("nodemailer");

const createBlog = async (parent, args, context) => {
  const { createBlogInput } = args;
  const { id: authorId } = context;
  try {
    const createdBlog = new Blog({
      authorId,
      ...createBlogInput,
    });
    if (!createdBlog.slug) {
      createdBlog.slug = toSlug(createBlogInput.title);
    }

    const savedBlog = await createdBlog.save();

    // const subscribers = await Subscriber.find();

    // transporter.sendMail({
    //   from: '"ITS" <duychomap123@gmail.com>',
    //   to: subscribers.map((subscriber) => subscriber.email).join(", "),
    //   subject: "New Blog",
    //   text: `New blog: ${savedBlog.title}`,
    //   html: `<b>New blog</b>: ${savedBlog.title}`,
    // });

    return savedBlog;
  } catch (error) {
    throw error;
  }
};

const author = async (parent, args, context) => {
  try {
    const { authorId } = parent;

    const existingAuthor = await Author.findById(authorId);

    if (!existingAuthor) throw new Error("Not found");

    return existingAuthor;
  } catch (error) {
    throw error;
  }
};

const deletedBlogs = async (parent, args, context) => {
  try {
    const { blogsInput } = args;

    const { limit, p, sortBy, sortType, keyword } = blogsInput;

    const where = {
      $or: [
        { title: new RegExp(keyword, "i") },
        { slug: new RegExp(keyword, "i") },
      ],
      deletedAt: {
        $ne: null,
      },
    };

    let query = Blog.find(where).sort({
      [sortBy || "deletedAt"]: sortType === "asc" ? "asc" : "desc",
    });
    if (limit) {
      if (p) {
        query = query.skip(limit * (p - 1));
      }
      query = query.limit(limit);
    }

    const blogs = await query;

    const count = await Blog.count(where);

    const totalPages = limit ? Math.ceil(count / limit) : 1;

    return {
      blogs,
      count,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};
const blogs = async (parent, args, context) => {
  try {
    const subscribers = await Subscriber.find();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    await transporter.sendMail({
      from: '"ITS" <duychomap123@gmail.com>',
      to: subscribers.map((subscriber) => subscriber.email).join(", "),
      subject: "New Blog",
      text: `New blog: Hướng Dẫn Tự Học Lập Trình Cơ Bản Dành Cho Người Mới Bắt Đầu`,
      html: `<b>New blog</b>: Hướng Dẫn Tự Học Lập Trình Cơ Bản Dành Cho Người Mới Bắt Đầu`,
    });
  } catch (error) {
    console.log(error);
  }
  try {
    const { blogsInput } = args;

    const { limit, p, sortBy, sortType, keyword, categoryIds, slug } =
      blogsInput;

    const categoryWhere = {};
    if (categoryIds) {
      if (categoryIds.length > 1) {
        categoryWhere["$and"] = [];
        categoryIds.forEach((categoryId) => {
          categoryWhere["$and"].push({ categoryIds: categoryId });
        });
      } else {
        categoryWhere.categoryIds = categoryIds[0];
      }
    }

    const where = {
      $or: [
        { title: new RegExp(keyword, "i") },
        { slug: new RegExp(keyword, "i") },
        { content: new RegExp(keyword, "i") },
      ],
      ...categoryWhere,
      ...(slug ? { slug } : {}),
      deletedAt: null,
    };

    let query = Blog.find(where).sort({
      [sortBy || "createdAt"]: sortType === "asc" ? "asc" : "desc",
    });
    if (limit) {
      if (p) {
        query = query.skip(limit * (p - 1));
      }
      query = query.limit(limit);
    }

    const blogs = await query;

    const count = await Blog.count(where);

    const totalPages = limit ? Math.ceil(count / limit) : 1;

    return {
      blogs,
      count,
      totalPages,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateBlog = async (parent, args, input) => {
  try {
    const { updateBlogInput } = args;

    const { id, title, slug, content, categoryIds, thumbnail } =
      updateBlogInput;

    const existingBlog = await Blog.findById(id);

    let isUpdated = false;

    if (existingBlog) {
      if (title && existingBlog.title !== title) {
        // update title
        existingBlog.title = title;
        if (!slug || existingBlog.slug === slug) {
          // update thêm slug
          existingBlog.slug = toSlug(title);
        }
      } else if (slug && existingBlog.slug !== slug) {
        // chỉ update slug
        existingBlog.slug = slug;
      }
      if (content) {
        existingBlog.content = content;
      }
      if (categoryIds) {
        existingBlog.categoryIds = categoryIds;
      }
      if (thumbnail) {
        existingBlog.thumbnail = thumbnail;
      }
      await existingBlog.save();
      isUpdated = true;
    }

    return isUpdated;
  } catch (error) {
    throw error;
  }
};
const deleteBlogs = async (parent, args, context) => {
  try {
    const { idList } = args;

    const result = await Blog.deleteMany({
      _id: {
        $in: idList,
      },
    });

    return result.deletedCount > 0;
  } catch (error) {
    throw error;
  }
};

const categories = async (parent, args, context) => {
  try {
    const { categoryIds } = parent;

    if (categoryIds) {
      const categories = await Category.find({
        _id: {
          $in: categoryIds,
        },
      });

      return categories;
    }

    return [];
  } catch (error) {
    throw error;
  }
};

const softDeleteBlogs = async (parent, args, context) => {
  try {
    const { idList } = args;

    const result = await Blog.updateMany(
      {
        _id: {
          $in: idList,
        },
      },
      {
        deletedAt: new Date(),
      }
    );

    console.log(result, idList);

    return result.modifiedCount > 0;
  } catch (error) {
    throw error;
  }
};

const restoreBlogs = async (parent, args, context) => {
  try {
    const { idList } = args;

    const result = await Blog.updateMany(
      {
        _id: {
          $in: idList,
        },
      },
      {
        deletedAt: null,
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    throw error;
  }
};

const blog = async (parent, args, context) => {
  try {
    const { id } = args;
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) throw new Error("Not found");
    return existingBlog;
  } catch (error) {
    throw error;
  }
};

const blogResolver = {
  createBlog,
  blogs,
  author,
  deletedBlogs,
  updateBlog,
  deleteBlogs,
  softDeleteBlogs,
  restoreBlogs,
  blog,
  categories,
};

module.exports = blogResolver;
