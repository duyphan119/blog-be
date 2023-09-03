const authTypeDefs = require("./auth.type-def");
const authorTypeDefs = require("./author.type-def");
const blogTypeDefs = require("./blog.type-def");
const categoryTypeDefs = require("./category.type-def");
const clientTypeDefs = require("./client.type-def");
const contactTypeDefs = require("./contact.type-def");
const notificationTypeDefs = require("./notification.type-def");
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

    contacts(contactsInput: ContactsInput): Contacts

    githubFollowers: Int
    youtubeSubscribers: Int

    notifications(notificationsInput: NotificationsInput): Notifications
  }
`;

const mutation = `#graphql
  type Mutation {
    login(loginInput: LoginInput): Auth
    register(registerInput: RegisterInput): Auth
    logout: Boolean

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

    createContact(createContactInput: CreateContactInput): Contact
    deleteContacts(idList: [String]): Boolean

    createSubscriber(createSubscriberInput: CreateSubscriberInput): Subscriber

    readNotifications(idList: [String]): Boolean
  }
`;

const subscription = `#graphql
  type Subscription {
    blogAdded: Blog
    notificationAdded: Notification
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
  contactTypeDefs,
  notificationTypeDefs,
  [scalars, query, mutation, subscription],
].flat();

module.exports = typeDefs;
