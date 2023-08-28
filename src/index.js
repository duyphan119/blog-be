const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

require("dotenv").config();
const connectDB = require("./config/db");
const typeDefs = require("./type-defs");
const resolvers = require("./resolvers");
const { getToken } = require("./middlewares/auth.middleware");
const { IS_PRODUCTION, BLOG_URL, DASHBOARD_URL } = require("./utils/constants");

const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

server.start().then(() => {
  app.use(
    cors({
      credentials: true,
      origin: IS_PRODUCTION
        ? [BLOG_URL, DASHBOARD_URL]
        : ["http://localhost:5173", "http://localhost:3000"],
    }),
    cookieParser(),
    getToken,
    bodyParser.json(),
    expressMiddleware(server, {
      context: ({ req, res }) => ({ req, res, ...res.locals }),
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
