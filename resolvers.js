import { quates, users } from "./fakeDB.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const User = mongoose.model("User");

const resolvers = {
  Query: {
    greet: () => "Hello world.",
    users: () => users,
    user: (parent, { _id }) => users.find((user) => user._id == _id),
    quates: () => quates,
    iquote: (parent, { _id }) => quates.filter((quote) => quote.by == _id),
  },
  User: {
    quates: (user) => quates.filter((quate) => quate.by == user._id),
  },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      const hashPassword = await bcrypt.hash(userNew.password, 12);
      console.log("hashPassword---userNew", hashPassword, userNew);
      if (user) {
        throw new Error("User already exist with this email");
      }
      const newUser = new User({
        ...userNew,
        password: hashPassword,
      });
      await newUser.save();
      return newUser;
    },
    

    signInUser: async (_, { signIn }) => {
      const user = await User.findOne({ email: signIn.email });
      const hashPassword = await bcrypt.hash(userNew.password, 12);
      console.log("hashPassword---signIn", hashPassword, signIn);
      if (user) {
        throw new Error("User already exist with this email");
      }
      throw new Error("User doesn't exist with this email");;
    },
  },
};

export default resolvers;
