const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Wszystkie endpointy wymagają autoryzacji
router.use(authenticateToken);

// Rate limiting dla endpointów wizyt
router.use(apiLimiter);

// GET /api/appointments - Pobierz wszystkie wizyty
router.get('/', appointmentController.getAllAppointments);

// GET /api/appointments/client/:clientId - Pobierz wizyty dla klienta (musi być PRZED ":id")
router.get('/client/:clientId', appointmentController.getAppointmentsByClient);

// BY EXTERNAL ID (appointmentId)
router.get('/by-external/:appointmentId', appointmentController.getAppointmentByExternalId);
router.post('/by-external/:appointmentId/confirm', appointmentController.confirmAppointmentByExternalId);
router.post('/by-external/:appointmentId/cancel', appointmentController.cancelAppointmentByExternalId);
router.put('/by-external/:appointmentId/status', appointmentController.updateAppointmentStatusByExternalId);

// GET /api/appointments/:id - Pobierz wizytę po Mongo _id
router.get('/:id', appointmentController.getAppointmentById);

// POST /api/appointments - Utwórz nową wizytę
router.post('/', appointmentController.createAppointment);

// PUT /api/appointments/:id - Aktualizuj wizytę
router.put('/:id', appointmentController.updateAppointment);

// DELETE /api/appointments/:id - Usuń wizytę
router.delete('/:id', appointmentController.deleteAppointment);

// POST /api/appointments/:id/confirm - Potwierdź wizytę po Mongo _id
router.post('/:id/confirm', appointmentController.confirmAppointment);

// POST /api/appointments/:id/cancel - Anuluj wizytę po Mongo _id
router.post('/:id/cancel', appointmentController.cancelAppointment);

// PUT /api/appointments/:id/status - Zmień status po Mongo _id
router.put('/:id/status', appointmentController.updateAppointmentStatus);

module.exports = router;
