const inputs = `#graphql
  input CreateContactInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    message: String!
  }
  input ContactsInput {
    limit: Int
    p: Int
    sortBy: String
    sortType: String
    keyword: String
  }
`;

const types = `#graphql
  type Contact {
    _id: String
    firstName: String
    lastName: String
    email: String
    phone: String
    message: String
    createdAt: Date
    updatedAt: Date
  }
  type Contacts {
    contacts: [Contact]
    count: Int
    totalPages: Int    
  }
`;

const contactTypeDefs = [types, inputs];

module.exports = contactTypeDefs;
