const authTypeDefs = require("./auth.type-def");
const authorTypeDefs = require("./author.type-def");
const blogTypeDefs = require("./blog.type-def");
const categoryTypeDefs = require("./category.type-def");
const clientTypeDefs = require("./client.type-def");
const replyTypeDefs = require("./reply.type-def");
const subscriberTypeDefs = require("./subscriber.type-def");

const scalars = `#graphql 
  scalar Date
`;

const query = `#graphql
  type Query {
    profile: Author
    
    categories(categoriesInput: CategoriesInput): Categories
    rootCategories: [Category]
    category(id: String): Category
    deletedCategories(categoriesInput: CategoriesInput): Categories

    blogs(blogsInput: BlogsInput): Blogs
    blog(id: String): Blog
    deletedBlogs(blogsInput: BlogsInput): Blogs

    homePage: HomePage
    dashboardPage: DashboardPage

    replies(repliesInput: RepliesInput): Replies

    githubFollowers: Int
    youtubeSubscribers: Int
  }
`;

const mutation = `#graphql
  type Mutation {
    login(loginInput: LoginInput): Auth
    register(registerInput: RegisterInput): Auth

    createCategory(createCategoryInput: CreateCategoryInput): Category
    updateCategory(updateCategoryInput: UpdateCategoryInput): Boolean
    deleteCategories(idList: [String]): Boolean
    softDeleteCategories(idList: [String]): Boolean
    restoreCategories(idList: [String]): Boolean

    createBlog(createBlogInput: CreateBlogInput): Blog
    updateBlog(updateBlogInput: UpdateBlogInput): Boolean
    deleteBlogs(idList: [String]): Boolean
    softDeleteBlogs(idList: [String]): Boolean
    restoreBlogs(idList: [String]): Boolean

    createReply(createReplyInput: CreateReplyInput): Reply

    createSubscriber(createSubscriberInput: CreateSubscriberInput): Subscriber
  }
`;

const subscription = `#graphql
  type Subscription {
    blogAdded: Blog
  }
`;

const typeDefs = [
  authTypeDefs,
  blogTypeDefs,
  authorTypeDefs,
  categoryTypeDefs,
  clientTypeDefs,
  replyTypeDefs,
  subscriberTypeDefs,
  [scalars, query, mutation, subscription],
].flat();

module.exports = typeDefs;
