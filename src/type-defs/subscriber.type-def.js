const inputs = `#graphql
  input CreateSubscriberInput {
    email: String!
  }
`;

const types = `#graphql
  type Subscriber {
    _id: String
    email: String
    createdAt: Date
    updatedAt: Date
  }
`;

const subscriberTypeDefs = [types, inputs];

module.exports = subscriberTypeDefs;
