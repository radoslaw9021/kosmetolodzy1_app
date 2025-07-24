const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'cosmetologist'], 
    default: 'cosmetologist' 
  },
  // Profil kosmetologa (tylko dla cosmetologist)
  profile: {
    specialization: { type: String }, // np. "twarz", "ciało", "makijaż"
    experience: { type: Number }, // lata doświadczenia
    bio: { type: String }, // krótki opis
    avatar: { type: String }, // URL zdjęcia profilowego
    phone: { type: String }, // telefon kontaktowy
    address: { type: String } // adres gabinetu
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  permissions: [{
    type: String,
    enum: [
      'manage_clients',
      'manage_treatments', 
      'manage_signatures',
      'export_data',
      'view_reports'
    ]
  }]
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if user has permission
userSchema.methods.hasPermission = function(permission) {
  return this.role === 'admin' || this.permissions.includes(permission);
};

// Check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Check if user is cosmetologist
userSchema.methods.isCosmetologist = function() {
  return this.role === 'cosmetologist';
};

// Get user full name
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = mongoose.model('User', userSchema); 