const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  operation: { type: String, required: true }, // np. access, create, update, export, sign
  resourceType: { type: String, required: true }, // np. client, signature
  resourceId: { type: String, required: true },
  userId: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema); 