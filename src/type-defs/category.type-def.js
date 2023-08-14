const inputs = `#graphql
  input CreateCategoryInput {
    name: String!
    parentId: String
    slug: String
  }
  input UpdateCategoryInput {
    name: String
    parentId: String
    slug: String
    id: String
  }
  input CategoriesInput {
    limit: Int
    p: Int
    sortBy: String
    sortType: String
    keyword: String
    slug: String
  }
`;

const types = `#graphql
  type Category {
    _id: String
    name: String
    parentId: String
    slug: String
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    parent: Category
    children: [Category]
  }
  type Categories {
    categories: [Category]
    count: Int
    totalPages: Int    
  }
`;

const categoryTypeDefs = [types, inputs];

module.exports = categoryTypeDefs;
