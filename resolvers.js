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
    quates: async () => await Quote.find().populate("by", "_id firstName"),
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
      try {
        const user = await User.findOne({ email: userNew.email });
        const hashPassword = await bcrypt.hash(userNew.password, 12);
        if (user) {
          return {
            code: 400,
            status: false,
            message: "User already exist with this email",
          };
        }
        const newUser = new User({
          ...userNew,
          password: hashPassword,
        });
        await newUser.save();
        // return newUser;
        return {
          code: 200,
          status: true,
          message: "Signup successfully",
          User: newUser,
        };
      } catch (error) {
        return {
          code: 500,
          status: false,
          message: "Something went to wrong. Please try again!",
        };
      }
    },

    signInUser: async (_, { signIn }) => {
      try {
        const user = await User.findOne({ email: signIn.email });
        if (!user) {
          return {
            code: 400,
            status: false,
            message: "User doesn't exist with this email",
          };
        }
        const isMatched = await bcrypt.compare(signIn.password, user.password);

        if (!isMatched) {
          return {
            code: 400,
            status: false,
            message: "Email and Password is inValid.",
          };
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
         return {
          code: 200,
          status: true,
          message: "Signin successfully",
          Token: token,
        };
      } catch (error) {
        return {
          code: 500,
          status: false,
          message: "Something went to wrong. Please try again!",
        };
      }
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
