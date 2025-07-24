const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validateClientData, sanitizeInput, rateLimit } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// GET /api/clients - Get all clients (with optional filtering)
router.get('/', authenticateToken, rateLimit, clientController.getAllClients);

// GET /api/clients/:id - Get single client by ID
router.get('/:id', authenticateToken, rateLimit, clientController.getClientById);

// POST /api/clients - Create new client
router.post('/', authenticateToken, rateLimit, sanitizeInput, validateClientData, clientController.createClient);

// PUT /api/clients/:id - Update client
router.put('/:id', authenticateToken, rateLimit, sanitizeInput, validateClientData, clientController.updateClient);

// DELETE /api/clients/:id - Delete client
router.delete('/:id', authenticateToken, rateLimit, clientController.deleteClient);

// POST /api/clients/:id/archive - Archive client
router.post('/:id/archive', authenticateToken, rateLimit, clientController.archiveClient);

// POST /api/clients/:id/unarchive - Unarchive client
router.post('/:id/unarchive', authenticateToken, rateLimit, clientController.unarchiveClient);

// GET /api/clients/:id/activity - Get activity logs for client
router.get('/:id/activity', authenticateToken, rateLimit, clientController.getClientActivityLogs);

module.exports = router; 