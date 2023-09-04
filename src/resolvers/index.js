const { GraphQLScalarType } = require("graphql");
const authResolver = require("./auth.resolver");
const blogResolver = require("./blog.resolver");
const categoryResolver = require("./category.resolver");
const clientResolver = require("./client.resolver");
const contactResolver = require("./contact.resolver");
const notificationResolver = require("./notification.resolver");
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
    ...authResolver.Query,
    ...clientResolver.Query,
    ...categoryResolver.Query,
    ...blogResolver.Query,
    ...contactResolver.Query,
    ...replyResolver.Query,
    ...subscriberResolver.Query,
    ...notificationResolver.Query,
  },
  Category: categoryResolver.Category,
  Blog: blogResolver.Blog,
  Reply: replyResolver.Reply,
  Mutation: {
    ...authResolver.Mutation,
    ...categoryResolver.Mutation,
    ...blogResolver.Mutation,
    ...contactResolver.Mutation,
    ...replyResolver.Mutation,
    ...subscriberResolver.Mutation,
    ...notificationResolver.Mutation,
  },
  Subscription: {
    ...blogResolver.Subscription,
    ...contactResolver.Subscription,
    ...replyResolver.Subscription,
  },
};

module.exports = resolvers;
