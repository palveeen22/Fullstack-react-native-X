// app.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { responseTypeDefs } = require("./schemas/response");
const PORT = process.env.PORT || 3000;
const mongoConnection = require("./config/db");
const { userTypeDefs, userResolvers } = require("./schemas/user");
const { postTypeDefs, postResolvers } = require("./schemas/post");
const { followTypeDefs, followResolvers } = require("./schemas/follow");
const authentication = require("./utils/auth");
const { GraphQLError } = require("graphql");

const server = new ApolloServer({
  typeDefs: [responseTypeDefs, userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  context: async ({ req }) => {
    return {
      doAuthentication: async () => await authentication(req),
    };
  },
});

(async () => {
  try {
    await mongoConnection.connect();
    const { url } = await startStandaloneServer(server, {
      listen: {
        port: PORT,
      },
      context: async ({ req }) => {
        // console.log("this console will be triggered on every request");

        return {
          dummyFunction: () => console.log("dummy function"),
          doAuthentication: async () => await authentication(req),
        };
      },
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
    throw new GraphQLError("Failed to start server");
  }
})();
