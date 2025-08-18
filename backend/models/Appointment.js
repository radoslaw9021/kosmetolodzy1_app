const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // ID wizyty (z kalendarza)
  appointmentId: {
    type: String,
    required: true,
    unique: true
  },
  
  // ID klienta
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  
  // Nazwa zabiegu
  treatment: {
    type: String,
    required: true
  },
  
  // Data i czas rozpoczęcia
  start: {
    type: Date,
    required: true
  },
  
  // Data i czas zakończenia
  end: {
    type: Date,
    required: true
  },
  
  // Status wizyty
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Kolor w kalendarzu
  color: {
    type: String,
    default: '#a855f7'
  },
  
  // Dodatkowe informacje
  notes: {
    type: String,
    default: ''
  },
  
  // Data utworzenia
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Data ostatniej aktualizacji
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indeksy dla lepszej wydajności
appointmentSchema.index({ clientId: 1, start: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentId: 1 });

// Middleware do aktualizacji updatedAt
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
