const { users, tasks } = require("../constants");

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
    createTask: (_, { input }) => {
      const task = { ...input, id: String(tasks.length + 1) };

      tasks.push(task);
      console.log("here the array");
      console.log(tasks);
      return task;
    }
  },
  Task: {
    user: ({ userId }) => users.find(user => user.id === userId)
  }
};
