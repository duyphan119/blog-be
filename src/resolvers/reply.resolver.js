const Blog = require("../models/blog.model");
const Reply = require("../models/reply.model");
const { PubSub } = require("graphql-subscriptions");

const pubSub = new PubSub();

const createReply = async (parent, args, context) => {
  try {
    const { createReplyInput } = args;

    const createdReply = new Reply(createReplyInput);

    const savedReply = await createdReply.save();

    pubSub.publish("replyAdded", { replyAdded: savedReply });

    return savedReply;
  } catch (error) {
    throw error;
  }
};

const replies = async (parent, args, context) => {
  try {
    const { repliesInput } = args;

    const { limit, p, sortBy, sortType, blogId, keyword } = repliesInput;
    const where = {
      ...(blogId ? { blogId } : {}),
      ...(keyword
        ? {
            $or: [
              { name: new RegExp(keyword, "i") },
              { email: new RegExp(keyword, "i") },
              { website: new RegExp(keyword, "i") },
              { content: new RegExp(keyword, "i") },
            ],
          }
        : {}),
    };
    let query = Reply.find(where).sort({
      [sortBy || "createdAt"]: sortType === "asc" ? "asc" : "desc",
    });
    if (limit) {
      if (p) {
        query = query.skip(limit * (p - 1));
      }
      query = query.limit(limit);
    }

    const replies = await query;

    const count = await Reply.count(where);

    const totalPages = limit ? Math.ceil(count / limit) : 1;

    return {
      replies,
      count,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};

const blog = async (parent, args, context) => {
  try {
    const { blogId } = parent;
    const existingBlog = await Blog.findById(blogId);
    return existingBlog;
  } catch (error) {
    return null;
  }
};

const replyAdded = () => pubSub.asyncIterator(["replyAdded"]);

const replyResolver = {
  Mutation: { createReply },
  Query: { replies },
  Reply: { blog },
  Subscription: { replyAdded: { subscribe: replyAdded } },
};

module.exports = replyResolver;
