const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");

require("dotenv").config();
const connectDB = require("./config/db");
const typeDefs = require("./type-defs");
const resolvers = require("./resolvers");
const { getToken } = require("./middlewares/auth.middleware");

const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
server.start().then(() => {
  app.use(
    cors(),
    getToken,
    bodyParser.json(),
    expressMiddleware(server, {
      context: ({ req, res }) => ({ req, res, id: res.locals.id }),
    })
  );

  connectDB.then(() => {
    httpServer.listen(PORT, () =>
      console.log(
        "Running a GraphQL API server at http://localhost:4000/graphql"
      )
    );
  });
});
