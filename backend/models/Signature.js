// models/Signature.js

const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type: { type: String, enum: ['rodo', 'marketing', 'photo'], required: true },
  filePath: { type: String, required: true },
  signedAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Signature', signatureSchema);
