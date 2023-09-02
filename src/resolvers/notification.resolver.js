const Notification = require("../models/notification.model");

const notifications = async (parent, args, context) => {
  try {
    const { notificationsInput } = args;

    const { limit, p, sortBy, sortType, keyword } = notificationsInput;

    const where = {
      ...(keyword
        ? {
            $or: [{ title: new RegExp(keyword, "i") }],
          }
        : {}),
    };

    let query = Notification.find(where).sort({
      [sortBy || "createdAt"]: sortType === "asc" ? "asc" : "desc",
    });

    if (limit) {
      if (p) {
        query = query.skip(limit * (p - 1));
      }
      query = query.limit(limit);
    }

    const notifications = await query;

    const count = await Notification.count(where);

    const totalPages = limit ? Math.ceil(count / limit) : 1;

    return {
      notifications,
      count,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};

const notificationResolver = {
  Query: { notifications },
  Mutation: {},
};

module.exports = notificationResolver;
