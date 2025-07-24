const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const { authenticateToken } = require('../middleware/auth');
const { sanitizeInput, rateLimit } = require('../middleware/validation');

// POST /api/treatments - Dodaj nowy zabieg
router.post('/', authenticateToken, rateLimit, sanitizeInput, treatmentController.addTreatment);

// GET /api/treatments/client/:clientId - Pobierz zabiegi dla klienta
router.get('/client/:clientId', authenticateToken, rateLimit, treatmentController.getTreatmentsForClient);

// PUT /api/treatments/:id - Aktualizuj zabieg
router.put('/:id', authenticateToken, rateLimit, sanitizeInput, treatmentController.updateTreatment);

// DELETE /api/treatments/:id - Usuń zabieg
router.delete('/:id', authenticateToken, rateLimit, treatmentController.deleteTreatment);

module.exports = router; 