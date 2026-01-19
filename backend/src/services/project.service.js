const Project = require("../models/Project");

const createProject = async ({ title, description, ownerId }) => {
  if (!title || !description || !ownerId) {
    throw new Error("Invalid credentials");
  }
  return await Project.create({
    title,
    description,
    owner: ownerId,
  });
};

const getProjects = async (ownerId) => {
  return await Project.find({ owner: ownerId });
};

const getProjectById = async (id, ownerId) => {
  const project = await Project.findOne({
    _id: id,
    owner: ownerId,
  });

  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};

const updateProject = async (id, ownerId, updateData) => {
  const project = await Project.findOne({
    _id: id,
    owner: ownerId,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (updateData.title) project.title = updateData.title;
  if (updateData.description) project.description = updateData.description;

  return await project.save();
};

const deleteProject = async (id, ownerId) => {
  const project = await Project.findOneAndDelete({
    _id: id,
    owner: ownerId,
  });

  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
