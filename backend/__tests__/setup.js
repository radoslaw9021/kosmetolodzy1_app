const mongoose = require('mongoose');

// Po każdym teście
afterEach(async () => {
  // Wyczyść wszystkie kolekcje
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Obsługa błędów połączenia
mongoose.connection.on('error', (err) => {
  console.error('❌ Błąd połączenia MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Połączenie MongoDB zostało rozłączone');
}); 