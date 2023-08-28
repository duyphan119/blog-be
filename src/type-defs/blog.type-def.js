const inputs = `#graphql
  input CreateBlogInput {
    title: String!
    content: String!
    slug: String
    thumbnail: String
    categoryIds: [String]!
    matchAllCategoryIds: Boolean
  }
  input UpdateBlogInput {
    title: String
    content: String
    slug: String
    id: String  
    thumbnail: String
    categoryIds: [String]
  }
  input BlogsInput {
    limit: Int
    p: Int
    sortBy: String
    sortType: String
    keyword: String
    slug: String
    categoryIds: [String]
  }
`;

const types = `#graphql
  type Blog {
    _id: String
    title: String
    content: String
    slug: String
    authorId: String
    author: Author
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    categoryIds: [String]
    categories: [Category]  
    thumbnail: String
  }
  type Blogs {
    blogs: [Blog]
    count: Int
    totalPages: Int    
  }
`;

const blogTypeDefs = [types, inputs];

module.exports = blogTypeDefs;
