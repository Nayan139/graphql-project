import { gql } from "apollo-server-core";

//Query
// Below are the Types schema
const typeDefs = gql`

  type Query {
    greet: String
    users: [User]
    user(_id: ID!): User
    iquote(_id: ID!): [Quate]
    quates: [QuatewithName]
  }

  type QuatewithName{
    name:String!
    by:IdName
  }

  type IdName{
    _id:String
    firstName:String
  }

  type User {
    _id: ID
    firstName: String!
    lastName: String!
    email: String!
    password:String!
    quates: [Quate]
  }

  type Quate {
    name: String!
    by: ID!
  }

  type Token {
    token: String!
  }


  type Mutation {
    signupUser(userNew:UserInput!):User
    signInUser(signIn: SigninInput!): Token
    createQuote(name: String!): String!
  }

  input SigninInput{
    email: String!
    password: String!
  }

  input UserInput{
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
`;

export default typeDefs;
