import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { quates, users } from "./fakeDB.js";

const typeDefs = gql`
  type Query {
    greet: String
    users: [User]
    user(id: ID!): User
    iquote(id: ID!): [Quate]
    quates: [Quate]
  }

  type User {
    id: ID
    name: String
    email: String
    age: String
    quates: [Quate]
  }

  type Quate {
    name: String
    by: ID!
  }
`;

const resolvers = {
  Query: {
    greet: () => "Hello world.",
    users: () => users,
    user: (parent, { id }) => users.find((user) => user.id == id),
    quates: () => quates,
    iquote: (parent, { id }) => quates.filter((quote) => quote.by == id),
  },
  User: {
    quates: (user) => quates.filter((quate) => quate.by == user.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server.listen().then(({ url }) => {
  console.log(`Server is running on the ${url}`);
});
