const inputs = `#graphql
  input CreateNotificationInput {
    title: String!
    type: String
  }
  input NotificationsInput {
    limit: Int
    p: Int
    sortBy: String
    sortType: String
    keyword: String
  }
`;

const types = `#graphql
  type Notification {
    _id: String
    title: String
    seen: Boolean
    refId: String
    type: String
    createdAt: Date
    updatedAt: Date
  }
  type Notifications {
    notifications: [Notification]
    totalPages: Int
    count: Int
  }
`;

const notificationTypeDefs = [types, inputs];

module.exports = notificationTypeDefs;
