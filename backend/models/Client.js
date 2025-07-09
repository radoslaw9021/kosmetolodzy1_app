const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  archived: { type: Boolean, default: false },
}, {
  timestamps: true // automatycznie dodaje createdAt i updatedAt
});

module.exports = mongoose.model('Client', clientSchema); 