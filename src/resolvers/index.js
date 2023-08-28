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
    ...authResolver.Query,
    ...clientResolver.Query,
    ...categoryResolver.Query,
    ...blogResolver.Query,
    replies: replyResolver.replies,
  },
  Category: categoryResolver.Category,
  Blog: blogResolver.Blog,
  Reply: {
    blog: replyResolver.blog,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...categoryResolver.Mutation,
    ...blogResolver.Mutation,
    createReply: replyResolver.createReply,
    createSubscriber: subscriberResolver.createSubscriber,
  },
  Subscription: {
    ...blogResolver.Subscription,
  },
};

module.exports = resolvers;
