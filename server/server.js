const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

async function startServerWithMiddleware() {
  await server.start();
  server.applyMiddleware({ app });
}

startServerWithMiddleware();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Application listening on http://localhost:${PORT}`);
    console.log(
      `GraphQL now listening at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});


// *********** pulled this from activity 21