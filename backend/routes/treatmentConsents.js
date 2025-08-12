const express = require('express');
const router = express.Router();
const treatmentConsentController = require('../controllers/treatmentConsentController');
const { authenticateToken } = require('../middleware/auth');
const { validateConsentData, sanitizeInput, rateLimit } = require('../middleware/validation');

// Tymczasowo wyłączone dla testów
// router.use(authenticateToken);

// POST /api/treatment-consents - Create/Update treatment consent
router.post('/', 
  rateLimit, 
  sanitizeInput, 
  // validateConsentData, // Tymczasowo wyłączone dla testów
  treatmentConsentController.createConsent
);

// GET /api/treatment-consents/client/:clientId - Get latest consent for a client
router.get('/client/:clientId', 
  rateLimit, 
  treatmentConsentController.getClientConsent
);

// GET /api/treatment-consents/client/:clientId/all - Get all consents for a client
router.get('/client/:clientId/all', 
  rateLimit, 
  treatmentConsentController.getClientConsents
);

// GET /api/treatment-consents/client/:clientId/stats - Get consent statistics
router.get('/client/:clientId/stats', 
  rateLimit, 
  treatmentConsentController.getConsentStats
);

// POST /api/treatment-consents/:id/invalidate - Invalidate consent
router.post('/:id/invalidate', 
  rateLimit, 
  treatmentConsentController.invalidateConsent
);

module.exports = router;
