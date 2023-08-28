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
  type DashboardPage {
    recentBlogs: [Blog]
    mostViewBlogs: [Blog]
    currentMonthCountBlog: Int
    previousMonthCountBlog: Int
    previousMonthCountReply: Int
    currentMonthCountReply: Int
  }
`;

const clientTypeDefs = [types];

module.exports = clientTypeDefs;
