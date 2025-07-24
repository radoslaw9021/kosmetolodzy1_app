// models/TreatmentHistory.js

const mongoose = require('mongoose');

const treatmentHistorySchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  treatmentName: String,
  date: Date,
  description: String,
  performedBy: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('TreatmentHistory', treatmentHistorySchema);
