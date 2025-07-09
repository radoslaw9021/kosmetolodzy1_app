const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

module.exports = async () => {
  try {
    console.log('🚀 Uruchamianie globalnego setupu testów...');
    
    // Uruchom MongoDB Memory Server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    // Połącz z testową bazą danych
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Globalny setup testów zakończony');
    
    // Zapisz URI do globalnej zmiennej
    global.__MONGOD_URI__ = uri;
    global.__MONGOD__ = mongod;
    
  } catch (error) {
    console.error('❌ Błąd podczas globalnego setupu:', error.message);
    throw error;
  }
}; 