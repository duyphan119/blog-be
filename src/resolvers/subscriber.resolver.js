const Subscriber = require("../models/subscriber.model");

const createSubscriber = async (parent, args, context) => {
  try {
    const { createSubscriberInput } = args;

    const createdSubscriber = new Subscriber(createSubscriberInput);

    const savedSubscriber = await createdSubscriber.save();

    return savedSubscriber;
  } catch (error) {
    throw error;
  }
};

const subscriberResolver = { Query: {}, Mutation: { createSubscriber } };

module.exports = subscriberResolver;
