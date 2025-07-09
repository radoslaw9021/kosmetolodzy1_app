const express = require('express');
const router = express.Router();
const treatmentHistoryController = require('../controllers/treatmentHistoryController');

// Dodaj nowy zabieg
router.post('/', treatmentHistoryController.addTreatment);
// Pobierz historię zabiegów dla klientki
router.get('/client/:clientId', treatmentHistoryController.getTreatmentsForClient);

module.exports = router; 