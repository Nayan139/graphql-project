import { quates, users } from "./fakeDB.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const User = mongoose.model("User");
const Quote = mongoose.model("Quote");

const resolvers = {
  Query: {
    greet: () => "Hello world.",
    users: async () => await User.find(),
    user: async (parent, { _id }) => await User.findById(_id),
    quates: async () => await Quote.find().populate("by","_id firstName"),
    iquote: async (parent, { _id }) => {
      const id = new ObjectId(_id);
      return await Quote.find({ by: id });
    },
  },
  User: {
    quates: async (user) => await Quote.find({ by: user._id }),
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
      if (!user) {
        throw new Error("User doesn't exist with this email");
      }
      const isMatched = await bcrypt.compare(signIn.password, user.password);

      if (!isMatched) {
        throw new Error("Email and Password is inValid.");
      }

      const token = Jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        "Test@123",
        {
          expiresIn: 31556926,
        }
      );
      console.log("hashPassword---signIn", isMatched, token);
      return { token };
    },

    createQuote: async (_, { name }, { userId, email }) => {
      if (!userId || !email) {
        throw new Error("User must be logged in");
      }

      const newQuate = new Quote({
        name: name,
        by: userId,
      });
      await newQuate.save();

      return "Quated Saved SuccessFully.";
    },
  },
};

export default resolvers;
