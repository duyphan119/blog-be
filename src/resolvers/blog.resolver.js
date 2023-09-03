const Blog = require("../models/blog.model");
const Author = require("../models/author.model");
const { toSlug } = require("../utils");
const Category = require("../models/category.model");
const Subscriber = require("../models/subscriber.model");
const { PubSub } = require("graphql-subscriptions");
const sendMail = require("../config/nodemailer");

const pubSub = new PubSub();

const createBlog = async (parent, args, context) => {
  const { id: authorId } = context;

  if (!authorId) throw new Error("Unauthorized");

  const { createBlogInput } = args;
  try {
    const createdBlog = new Blog({
      authorId,
      ...createBlogInput,
    });
    if (!createdBlog.slug) {
      createdBlog.slug = toSlug(createBlogInput.title);
    }

    const savedBlog = await createdBlog.save();

    sendMail(savedBlog);

    pubSub.publish("blogAdded", { blogAdded: savedBlog });

    return savedBlog;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const blogAdded = (...a) => {
  return pubSub.asyncIterator("blogAdded");
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
    const { id: authorId } = context;

    if (!authorId) throw new Error("Unauthorized");

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
      authorId,
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
    const { id: authorId } = context;

    const { blogsInput } = args;

    const {
      limit,
      p,
      sortBy,
      sortType,
      keyword,
      categoryIds,
      slug,
      matchAllCategoryIds,
    } = blogsInput;

    const categoryIdsWhere = (categoryIds || []).map((categoryId) => ({
      categoryIds: categoryId,
    }));
    let orConditions = [
      ...(keyword && keyword !== ""
        ? [
            { title: new RegExp(keyword, "i") },
            { slug: new RegExp(keyword, "i") },
          ]
        : []),
      ...categoryIdsWhere,
    ];
    let andConditions = matchAllCategoryIds ? categoryIdsWhere : [];

    const where = {
      ...(orConditions.length > 0 ? { $or: orConditions } : {}),
      ...(andConditions.length > 0 ? { $and: andConditions } : {}),
      ...(slug ? { slug } : {}),
      ...(authorId ? { authorId } : {}),
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

const updateBlog = async (parent, args, context) => {
  try {
    const { updateBlogInput } = args;

    const { id: authorId } = context;

    if (!authorId) throw new Error("Unauthorized");

    const { id, title, slug, content, categoryIds, thumbnail } =
      updateBlogInput;

    const existingBlog = await Blog.findOne({ _id: id, authorId });

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
    console.log(error);
    throw error;
  }
};
const deleteBlogs = async (parent, args, context) => {
  try {
    const { id: authorId } = context;

    if (!authorId) throw new Error("Unauthorized");

    const { idList } = args;

    const result = await Blog.deleteMany({
      _id: {
        $in: idList,
      },
      authorId,
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
    const { id: authorId } = context;

    if (!authorId) throw new Error("Unauthorized");

    const { idList } = args;

    const result = await Blog.updateMany(
      {
        _id: {
          $in: idList,
        },
        authorId,
      },
      {
        deletedAt: new Date(),
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    throw error;
  }
};

const restoreBlogs = async (parent, args, context) => {
  try {
    const { id: authorId } = context;

    if (!authorId) throw new Error("Unauthorized");

    const { idList } = args;

    const result = await Blog.updateMany(
      {
        _id: {
          $in: idList,
        },
        authorId,
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
  Query: {
    blogs,
    blog,
    deletedBlogs,
  },
  Mutation: {
    updateBlog,
    deleteBlogs,
    softDeleteBlogs,
    restoreBlogs,
    createBlog,
  },
  Blog: {
    categories,
    author,
  },
  Subscription: {
    blogAdded: { subscribe: blogAdded },
  },
};

module.exports = blogResolver;
