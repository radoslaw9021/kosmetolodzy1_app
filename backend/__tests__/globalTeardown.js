const mongoose = require('mongoose');

module.exports = async () => {
  try {
    console.log('🧹 Uruchamianie globalnego teardown testów...');
    
    // Zamknij połączenie z bazą danych
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    
    // Zatrzymaj MongoDB Memory Server
    if (global.__MONGOD__) {
      await global.__MONGOD__.stop();
    }
    
    console.log('✅ Globalny teardown testów zakończony');
    
  } catch (error) {
    console.error('❌ Błąd podczas globalnego teardown:', error.message);
    throw error;
  }
}; 