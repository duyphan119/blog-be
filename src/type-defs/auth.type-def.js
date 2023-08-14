const inputs = `#graphql
  input LoginInput {
    email: String!
    password: String!
  }
  input RegisterInput {
    email: String!
    password: String!
    name: String!
  }
`;

const types = `#graphql
  type Author {
    _id: String
    uid: String
    avatar: String
    name: String
    email: String
    createdAt: Date
    updatedAt: Date
  }

  type Auth {
    author: Author
    accessToken: String
  }
`;

const authTypeDefs = [inputs, types];

module.exports = authTypeDefs;
