const { users, tasks } = require("../constants");
const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./middleware");
const User = require("../database/models/user");
const Task = require("../database/models/task");

module.exports = {
  Query: {
    tasks: () => {
      return tasks;
    },
    task: (_, { id }) => {
      return tasks.find(task => task.id === id);
    }
  },
  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { email }) => {
        try {
          const user = await User.findOne({ email });
          const task = new Task({ ...input, user: user.id });
          const result = await task.save();
          user.tasks.push(result.id);
          await user.save();
          return result;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    )
  },
  Task: {
    user: ({ userId }) => users.find(user => user.id === userId)
  }
};
