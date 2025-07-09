const Queue = require('bull');

// Konfiguracja Redis (domyślnie localhost:6379)
const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null
  }
};

// Kolejka dla eksportów ZIP
const exportQueue = new Queue('export-zip', redisConfig);

// Kolejka dla przetwarzania dużych plików
const fileProcessingQueue = new Queue('file-processing', redisConfig);

// Konfiguracja limiterów
const rateLimiters = {
  export: {
    max: 5, // max 5 eksportów na minutę
    duration: 60000
  },
  upload: {
    max: 10, // max 10 uploadów na minutę
    duration: 60000
  }
};

module.exports = {
  exportQueue,
  fileProcessingQueue,
  rateLimiters
}; 