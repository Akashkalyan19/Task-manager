const projectService = require("../services/project.service");

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }
    const project = await projectService.createProject({
      title,
      description,
      ownerId: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(
      req.params.id,
      req.user.id,
    );
    res.json(project);
  } catch (err) {
    if (err.message === "Project not found") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const updatedProject = await projectService.updateProject(
      req.params.id,
      req.user.id,
      req.body,
    );
    res.json(updatedProject);
  } catch (err) {
    if (err.message === "Project not found") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.id);
    res.json({ message: "Project removed" });
  } catch (err) {
    if (err.message === "Project not found") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
