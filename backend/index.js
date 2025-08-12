// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { basicLimiter, apiLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./config/logger');
const {
  errorHandler,
  notFoundHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler,
  performanceMonitor
} = require('./middleware/errorHandler');

// Import routes
const clientRoutes = require('./routes/clients');
const signatureRoutes = require('./routes/signatures');
const exportRoutes = require('./routes/export');
const logsRoutes = require('./routes/logs');
const treatmentsRoutes = require('./routes/treatments');
const authRoutes = require('./routes/auth');
const treatmentConsentRoutes = require('./routes/treatmentConsents');

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection - wymaga zmiennej środowiskowej
if (process.env.NODE_ENV !== 'test') {
  const MONGODB_URI = process.env.MONGO_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ Błąd: Zmienna środowiskowa MONGO_URI nie jest ustawiona!');
    console.error('   Ustaw MONGO_URI w pliku .env lub jako zmienną środowiskową');
    console.error('   Przykład: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kosmetolodzy');
    process.exit(1);
  }
  
  const mongoose = require('mongoose');
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // 10 sekund timeout
  })
  .then(() => {
    console.log('✅ Połączono z bazą danych MongoDB');
  })
  .catch(err => {
    console.error('❌ Błąd połączenia z MongoDB:', err.message);
    console.error('   Sprawdź czy MONGO_URI jest poprawne i czy baza danych jest dostępna');
    process.exit(1);
  });
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Pozwól na requesty z localhost i określonych domen
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Pozwól na requesty bez origin (np. Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Pozwól na cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

// Middleware
app.use(cors(corsOptions));
app.use(basicLimiter); // Podstawowy rate limiter dla wszystkich requestów
app.use('/api', apiLimiter); // Rate limiter dla API
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging i monitoring
app.use(requestLogger);
app.use(performanceMonitor);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend działa!' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/signatures', signatureRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/treatments', treatmentsRoutes);
app.use('/api/treatment-consents', treatmentConsentRoutes);

// Error handling middleware (musi być na końcu)
app.use(notFoundHandler);
app.use(errorHandler);

// Global error handlers
process.on('unhandledRejection', unhandledRejectionHandler);
process.on('uncaughtException', uncaughtExceptionHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend API listening on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`API Documentation:`);
    console.log(`- Swagger UI: http://localhost:${PORT}/api-docs`);
    console.log(`- Postman Collection: http://localhost:${PORT}/api-docs.json`);
  });
}

module.exports = app;

// Uruchom worker do eksportów (wymaga Redis) - tylko jeśli Redis jest dostępne
if (process.env.NODE_ENV !== 'test') {
  try {
    require('./workers/exportWorker');
    console.log('Starting export worker...');
    console.log('Export worker started successfully');
  } catch (error) {
    console.warn('⚠️ Redis niedostępne - funkcjonalność eksportu będzie ograniczona');
    console.warn('   Błąd:', error.message);
  }
} 