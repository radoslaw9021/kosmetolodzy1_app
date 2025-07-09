const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sanitizeInput, rateLimit } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/login - Logowanie
router.post('/login', authLimiter, sanitizeInput, authController.login);

// POST /api/auth/register - Rejestracja (tylko admin)
router.post('/register', authLimiter, authenticateToken, requireAdmin, sanitizeInput, authController.register);

// GET /api/auth/profile - Pobierz profil użytkownika
router.get('/profile', rateLimit, authenticateToken, authController.getProfile);

// POST /api/auth/logout - Wylogowanie
router.post('/logout', rateLimit, authenticateToken, authController.logout);

module.exports = router; 