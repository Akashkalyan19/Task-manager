const taskService = require("../services/task.service");

// Create a task associated with a project (via nested route)
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assignedTo } =
      req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const task = await taskService.createTask({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assignedTo,
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    if (err.message === "Project not found or unauthorized") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const tasks = await taskService.getTasks(projectId, req.user.id);
    res.json(tasks);
  } catch (err) {
    if (err.message === "Project not found or unauthorized") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(
      req.params.id,
      req.user.id,
      req.body,
    );
    res.json(updatedTask);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
