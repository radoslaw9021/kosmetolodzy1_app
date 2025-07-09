const rateLimit = require('express-rate-limit');

// Podstawowy rate limiter
const basicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100, // max 100 requestów na okno
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter dla autoryzacji (bardziej restrykcyjny)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 5, // max 5 prób logowania na 15 minut
  message: {
    success: false,
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // nie liczy udanych logowań
});

// Rate limiter dla eksportu (bardzo restrykcyjny)
const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 godzina
  max: 10, // max 10 eksportów na godzinę
  message: {
    success: false,
    error: 'Too many export requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter dla uploadu plików
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 20, // max 20 uploadów na 15 minut
  message: {
    success: false,
    error: 'Too many file uploads, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter dla API (umiarkowany)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 300, // max 300 requestów na 15 minut
  message: {
    success: false,
    error: 'Too many API requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter dla adminów (wyższe limity)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 500, // max 500 requestów na 15 minut dla adminów
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Pomiń limiter jeśli użytkownik jest adminem
    return req.user && req.user.role === 'admin';
  }
});

module.exports = {
  basicLimiter,
  authLimiter,
  exportLimiter,
  uploadLimiter,
  apiLimiter,
  adminLimiter
}; 