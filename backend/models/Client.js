// models/Client.js

const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // Owner - który kosmetolog ma tego klienta
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Dane podstawowe
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  birthDate: { type: Date },
  gender: { type: String, enum: ['female', 'male', 'other'] },
  address: { type: String },
  
  // Informacje medyczne
  medical: {
    chronicDiseases: { type: String },
    medications: { type: String },
    supplements: { type: String },
    allergies: { type: String },
    additionalNotes: { type: String }
  },
  
  // Przeciwwskazania
  contraindications: {
    pregnancy: { type: Boolean, default: false },
    diabetes: { type: Boolean, default: false },
    syncope: { type: Boolean, default: false },
    varicoseVeins: { type: Boolean, default: false },
    thyroidDiseases: { type: Boolean, default: false },
    anemia: { type: Boolean, default: false },
    ulcers: { type: Boolean, default: false },
    kidneyFailure: { type: Boolean, default: false },
    pacemaker: { type: Boolean, default: false },
    substanceAbuse: { type: Boolean, default: false },
    cancer5Years: { type: Boolean, default: false },
    epilepsy: { type: Boolean, default: false },
    claustrophobia: { type: Boolean, default: false },
    activeInfection: { type: Boolean, default: false },
    seriousIllness: { type: Boolean, default: false },
    cardioDisease: { type: Boolean, default: false }
  },
  
  // Styl życia
  lifestyle: {
    sports: { type: Boolean, default: false },
    plannedPregnancy: { type: Boolean, default: false },
    healthyNutrition: { type: Boolean, default: false },
    metalImplants: { type: Boolean, default: false },
    pacemakerImplant: { type: Boolean, default: false },
    contactLenses: { type: Boolean, default: false },
    claustrophobiaC: { type: Boolean, default: false },
    vacationWarmCountries: { type: Boolean, default: false }
  },
  
  // Problemy skórne
  skinIssues: {
    acne: { type: Boolean, default: false },
    pigmentation: { type: Boolean, default: false },
    blackheads: { type: Boolean, default: false },
    comedones: { type: Boolean, default: false },
    scars: { type: Boolean, default: false },
    dryness: { type: Boolean, default: false },
    overSebum: { type: Boolean, default: false }
  },
  otherSkinIssue: { type: String },
  
  // Zgody
  consents: {
    rodo: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    newsletter: { type: Boolean, default: false },
    unsubscribed: { type: Boolean, default: false }
  },
  
  // Zabiegi
  treatments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' }],
  
  notes: { type: String },
  isArchived: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Client', clientSchema);
