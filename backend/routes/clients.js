const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validateClientData, sanitizeInput, rateLimit } = require('../middleware/validation');

// GET /api/clients - Get all clients (with optional filtering)
router.get('/', rateLimit, clientController.getAllClients);

// GET /api/clients/:id - Get single client by ID
router.get('/:id', rateLimit, clientController.getClientById);

// POST /api/clients - Create new client
router.post('/', rateLimit, sanitizeInput, validateClientData, clientController.createClient);

// PUT /api/clients/:id - Update client
router.put('/:id', rateLimit, sanitizeInput, validateClientData, clientController.updateClient);

// POST /api/clients/:id/archive - Archive client
router.post('/:id/archive', rateLimit, clientController.archiveClient);

// POST /api/clients/:id/unarchive - Unarchive client
router.post('/:id/unarchive', rateLimit, clientController.unarchiveClient);

// GET /api/clients/:id/activity - Get activity logs for client
router.get('/:id/activity', rateLimit, clientController.getClientActivityLogs);

module.exports = router; 