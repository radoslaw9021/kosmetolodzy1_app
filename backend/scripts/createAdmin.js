const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Połącz z MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kosmetolodzy';
    await mongoose.connect(MONGO_URI);
    console.log('Połączono z MongoDB');

    // Sprawdź czy admin już istnieje
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin już istnieje:', existingAdmin.email);
      process.exit(0);
    }

    // Utwórz admina
    const admin = new User({
      email: 'admin@kosmetolodzy.pl',
      password: 'admin123', // zostanie zahashowane automatycznie
      firstName: 'Administrator',
      lastName: 'Systemu',
      role: 'admin',
      permissions: ['manage_clients', 'manage_treatments', 'manage_signatures', 'export_data', 'view_reports'],
      isActive: true
    });

    await admin.save();
    console.log('Admin utworzony pomyślnie:');
    console.log('Email:', admin.email);
    console.log('Hasło: admin123');
    console.log('Zmień hasło po pierwszym logowaniu!');

    process.exit(0);
  } catch (error) {
    console.error('Błąd podczas tworzenia admina:', error);
    process.exit(1);
  }
};

createAdmin(); 