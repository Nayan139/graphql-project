import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import './db/db.config.js'

import "./models/user.js";
import"./models/quote.js";

import typeDefs from './schemaGql.js'
import resolvers from './resolvers.js'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server.listen().then(({ url }) => {
  console.log(`Server is running on the ${url}`);
});
