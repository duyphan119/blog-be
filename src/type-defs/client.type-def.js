const types = `#graphql
  type CountBlog {
    category: Category
    count: Int
    blogs: [Blog]
  }
  type HomePage {
    mostViewBlogs: [Blog]
    categories: [Category]
    countBlogs: [CountBlog]
    recentBlogs: [Blog]
  }
`;

const clientTypeDefs = [types];

module.exports = clientTypeDefs;
