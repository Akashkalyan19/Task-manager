const dashboardService = require("../services/dashboard.service");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await dashboardService.getDashboardStats(userId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

module.exports = {
  getDashboardStats,
};
