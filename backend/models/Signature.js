const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type: { type: String, enum: ['consent', 'medical', 'photo'], required: true },
  filePath: { type: String, required: true }, // ścieżka do pliku na serwerze
  originalName: { type: String }, // oryginalna nazwa pliku
  valid: { type: Boolean, default: true },
  signedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

module.exports = mongoose.model('Signature', signatureSchema); 