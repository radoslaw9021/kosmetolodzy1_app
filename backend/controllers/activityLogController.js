const ActivityLog = require('../models/ActivityLog');

const activityLogController = {
  // GET /api/logs?operation=&resourceType=&userId=&from=&to=&page=&limit=
  getLogs: async (req, res) => {
    try {
      const { operation, resourceType, userId, from, to, page = 1, limit = 20 } = req.query;
      let filter = {};
      if (operation) filter.operation = operation;
      if (resourceType) filter.resourceType = resourceType;
      if (userId) filter.userId = userId;
      if (from || to) {
        filter.timestamp = {};
        if (from) filter.timestamp.$gte = new Date(from);
        if (to) filter.timestamp.$lte = new Date(to);
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const logs = await ActivityLog.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await ActivityLog.countDocuments(filter);
      res.json({
        success: true,
        data: logs,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch logs',
        message: error.message
      });
    }
  }
};

module.exports = activityLogController; 