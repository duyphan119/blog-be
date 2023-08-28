const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  IS_PRODUCTION: isProduction,
  BLOG_URL: isProduction ? process.env.BLOG_URL : "http://localhost:3000",
  DASHBOARD_URL: isProduction
    ? process.env.DASHBOARD_URL
    : "http://localhost:5173",
};
