const Blog = require("../models/blog.model");
const Category = require("../models/category.model");
const { toSlug } = require("../utils");

const createCategory = async (parent, args, context) => {
  try {
    const { createCategoryInput } = args;

    const createdCategory = new Category(createCategoryInput);

    if (!createdCategory.slug) {
      createdCategory.slug = toSlug(createdCategory.name);
    }

    const savedCategory = await createdCategory.save();

    return savedCategory;
  } catch (error) {
    throw error;
  }
};

const children = async (parent, args, context) => {
  try {
    const { _id } = parent;

    const categories = await Category.find({
      parentId: _id,
    });

    return categories;
  } catch (error) {
    throw error;
  }
};

const categories = async (parent, args, context) => {
  try {
    const { categoriesInput } = args;

    const { limit, p, sortBy, sortType, keyword, slug } = categoriesInput;

    const where = {
      ...(keyword
        ? {
            $or: [
              { name: new RegExp(keyword, "i") },
              { slug: new RegExp(keyword, "i") },
            ],
          }
        : {}),
      ...(slug ? { slug } : {}),
      deletedAt: null,
    };

    let query = Category.find(where).sort({
      [sortBy || "createdAt"]: sortType === "asc" ? "asc" : "desc",
    });
    if (limit) {
      if (p) {
        query = query.skip(limit * (p - 1));
      }
      query = query.limit(limit);
    }

    const categories = await query;

    const count = await Category.count(where);

    const totalPages = limit ? Math.ceil(count / limit) : 1;

    return {
      categories,
      count,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};

const deletedCategories = async (parent, args, context) => {
  try {
    const { categoriesInput } = args;

    const { limit, p, sortBy, sortType, keyword, slug } = categoriesInput;

    const where = {
      ...(keyword
        ? {
            $or: [
              { name: new RegExp(keyword, "i") },
              { slug: new RegExp(keyword, "i") },
            ],
          }
        : {}),
      ...(slug ? { slug } : {}),
      deletedAt: {
        $ne: null,
      },
    };

    let query = Category.find(where).sort({
      [sortBy || "deletedAt"]: sortType === "asc" ? "asc" : "desc",
    });
    if (limit) {
      if (p) {
        query = query.skip(limit * (p - 1));
      }
      query = query.limit(limit);
    }

    const categories = await query;

    const count = await Category.count(where);

    const totalPages = limit ? Math.ceil(count / limit) : 1;

    return {
      categories,
      count,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};

const rootCategories = async (parent, args, context) => {
  try {
    const categories = Category.find({ parentId: null });
    return categories;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (parent, args, input) => {
  try {
    const { updateCategoryInput } = args;

    const { id, name, slug, parentId } = updateCategoryInput;

    const existingCategory = await Category.findById(id);

    let isUpdated = false;

    if (existingCategory) {
      if (name && existingCategory.name !== name) {
        // update name
        existingCategory.name = name;
        if (!slug || existingCategory.slug === slug) {
          // update thêm slug
          existingCategory.slug = toSlug(name);
        }
      } else if (slug && existingCategory.slug !== slug) {
        // chỉ update slug
        existingCategory.slug = slug;
      }
      if (parentId) {
        existingCategory.parentId = parentId;
      }
      await existingCategory.save();
      isUpdated = true;
    }

    return isUpdated;
  } catch (error) {
    throw error;
  }
};

const deleteCategories = async (parent, args, context) => {
  try {
    const { idList } = args;

    const result = await Category.deleteMany({
      _id: {
        $in: idList,
      },
    });

    return result.deletedCount > 0;
  } catch (error) {
    throw error;
  }
};

const softDeleteCategories = async (parent, args, context) => {
  try {
    const { idList } = args;

    const result = await Category.updateMany(
      {
        _id: {
          $in: idList,
        },
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

const restoreCategories = async (parent, args, context) => {
  try {
    const { idList } = args;

    const result = await Category.updateMany(
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

const category = async (parent, args, context) => {
  try {
    const { id } = args;
    console.log(args);
    const category = await Category.findById(id);
    if (!category) throw new Error("Not found");
    return category;
  } catch (error) {
    throw error;
  }
};

const parent = async (parent, args, context) => {
  try {
    const { parentId } = parent;

    const category = await Category.findById(parentId);
    return category;
  } catch (error) {
    throw error;
  }
};

const categoryResolver = {
  createCategory,
  categories,
  updateCategory,
  deleteCategories,
  softDeleteCategories,
  restoreCategories,
  rootCategories,
  category,
  parent,
  deletedCategories,
  children,
};

module.exports = categoryResolver;
