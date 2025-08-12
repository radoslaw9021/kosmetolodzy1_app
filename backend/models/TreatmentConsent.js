const mongoose = require('mongoose');

const treatmentConsentSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['treatment-consent'], 
    default: 'treatment-consent',
    required: true 
  },
  signature: { 
    type: String, // Base64 encoded signature image
    required: true 
  },
  hasConsented: { 
    type: Boolean, 
    default: false,
    required: true 
  },
  hasReadTerms: { 
    type: Boolean, 
    default: false,
    required: true 
  },
  signedAt: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  valid: { 
    type: Boolean, 
    default: true 
  },
  notes: { 
    type: String 
  }
}, { 
  timestamps: true 
});

// Index dla szybkiego wyszukiwania
treatmentConsentSchema.index({ clientId: 1, type: 1 });
treatmentConsentSchema.index({ signedAt: -1 });
treatmentConsentSchema.index({ valid: 1 });

module.exports = mongoose.model('TreatmentConsent', treatmentConsentSchema);
