const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const dotEnv = require("dotenv");
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const { connection } = require("./database/utils");
const { verifyUser } = require("./helper/context/");
// set env variables
dotEnv.config();
const app = express();

// database connect
connection();

//cors
app.use(cors());

//body parser middleware
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    await verifyUser(req);
    return { email: req.email };
  }
});

apolloServer.applyMiddleware({ app, path: "/graphql" });
const PORT = process.env.PORT || 3000;

app.use("/", (req, res, next) => {
  res.send({ message: "Hello" });
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
  console.log(`GraphQL Endpoint ${apolloServer.graphqlPath}`);
});
