const Task = require("../models/Task");
const Project = require("../models/Project");

const createTask = async ({
  title,
  description,
  status,
  priority,
  dueDate,
  projectId,
  assignedTo,
  userId,
}) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  return await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    project: projectId,
    assignedTo: assignedTo || userId,
  });
};

const getTasks = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  return await Task.find({ project: projectId }).populate(
    "assignedTo",
    "name email",
  );
};

const updateTask = async (taskId, userId, updateData) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  const project = await Project.findOne({ _id: task.project, owner: userId });
  if (!project) {
    throw new Error("Task not found (unauthorized)");
  }

  if (updateData.title) task.title = updateData.title;
  if (updateData.description) task.description = updateData.description;
  if (updateData.status) task.status = updateData.status;
  if (updateData.priority) task.priority = updateData.priority;
  if (updateData.dueDate) task.dueDate = updateData.dueDate;
  if (updateData.assignedTo) task.assignedTo = updateData.assignedTo;

  return await task.save();
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  const project = await Project.findOne({ _id: task.project, owner: userId });
  if (!project) {
    throw new Error("Task not found (unauthorized)");
  }

  await Task.findByIdAndDelete(taskId);
  return { message: "Task removed" };
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
