const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  notesInternal: { type: String },
  notesForClient: { type: String },
  recommendations: [{ type: String }],
  images: [{
    url: { type: String },
    label: { type: String },
    date: { type: Date }
  }],
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
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

module.exports = mongoose.model('Treatment', treatmentSchema); 