import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import  Jwt  from "jsonwebtoken";
import "./db/db.config.js";

import "./models/user.js";
import "./models/quote.js";

import typeDefs from "./schemaGql.js";
import resolvers from "./resolvers.js";
import { context } from "./helper/middleware.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server.listen().then(({ url }) => {
  console.log(`Server is running on the ${url}`);
});
