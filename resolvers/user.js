const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { combineResolvers } = require("graphql-resolvers");
const { users, tasks } = require("../constants");
const { isAuthenticated } = require("./middleware");
const User = require("../database/models/user");
module.exports = {
  Query: {
    users: () => {
      return users;
    },
    user: combineResolvers(isAuthenticated, (_, { id }, { email }) => {
      console.log("===", email);

      return users.find(user => user.id === id);
    })
  },
  Mutation: {
    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error("User not found");
        }
        const isPassword = await bcrypt.compare(input.password, user.password);
        if (!isPassword) {
          throw new Error("Invalid password");
        }
        const secret = process.env.JWT_SECRET_KEY || "mysecret";
        const token = jwt.sign({ email: user.email }, secret, {
          expiresIn: "1d"
        });

        return { token };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    signup: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (user) {
          throw new Error("User already in use");
        }
        const hashedPassword = await bcrypt.hash(input.password, 12);
        const newUser = new User({ ...input, password: hashedPassword });
        const result = await newUser.save();
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  User: {
    tasks: ({ id }) => tasks.filter(task => task.id === id)
  }
};
