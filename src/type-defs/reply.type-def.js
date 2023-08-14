const inputs = `#graphql
  input CreateReplyInput {
    name: String!
    email: String!
    content: String!
    website: String
    blogId: String
  }
  input RepliesInput {
    limit: Int
    p: Int
    sortBy: String
    sortType: String
    keyword: String
    blogId: String
  }
`;

const types = `#graphql
  type Reply {
    _id: String
    name: String
    email: String
    website: String
    content: String
    blogId: String
    blog: Blog
    createdAt: Date
    updatedAt: Date
  }
  type Replies {
    replies: [Reply]
    count: Int
    totalPages: Int    
  }
`;

const replyTypeDefs = [types, inputs];

module.exports = replyTypeDefs;
