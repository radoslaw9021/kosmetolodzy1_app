const mongoose = require('mongoose');

const treatmentHistorySchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  treatmentName: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  performedBy: { type: String },
  notes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('TreatmentHistory', treatmentHistorySchema); 