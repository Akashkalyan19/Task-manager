const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (userId) => {
  const projects = await Project.find({ owner: userId }).select("_id");
  const projectIds = projects.map((p) => p._id);

  const tasks = await Task.find({ project: { $in: projectIds } });

  return {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    tasksByStatus: {
      Todo: tasks.filter((t) => t.status === "Todo").length,
      "In Progress": tasks.filter((t) => t.status === "In Progress").length,
      Done: tasks.filter((t) => t.status === "Done").length,
    },
  };
};

module.exports = {
  getDashboardStats,
};
