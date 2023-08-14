const types = `#graphql
  type Author {
    id: String
    name: String
    avatar: String
    uid: String
    blogs: [Blog]
  }
`;

const authorTypeDefs = [types];

module.exports = authorTypeDefs;
