const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { validateExportRequest, sanitizeInput, rateLimit } = require('../middleware/validation');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { addExportJob, getJobStatus } = require('../jobs/exportJob');
const { authenticateToken, requirePermission } = require('../middleware/auth');
const { exportLimiter } = require('../middleware/rateLimiter');
const { requireExportPermission, requireSingleExportPermission, logExport } = require('../middleware/exportPermissions');
const { exportLogger } = require('../config/logger');

// GET /api/export/client/:clientId/pdf - Export single client to PDF (pracownik+)
router.get('/client/:clientId/pdf', exportLimiter, authenticateToken, requireSingleExportPermission, logExport, exportController.exportClientPDF);

// POST /api/export/bulk - Bulk export multiple clients (admin+)
router.post('/bulk', exportLimiter, authenticateToken, requireExportPermission, sanitizeInput, validateExportRequest, logExport, exportController.bulkExport);

// GET /api/export/consent/:type/template - Export consent form template
router.get('/consent/:type/template', rateLimit, exportController.exportConsentTemplate);

// GET /api/export/client/:clientId/treatments - Export treatment history
router.get('/client/:clientId/treatments', rateLimit, exportController.exportTreatmentHistory);

// GET /api/export/stats - Get export statistics
router.get('/stats', rateLimit, exportController.getExportStats);

// POST /api/export/clients/zip - Export multiple clients to ZIP (admin+)
router.post('/clients/zip', exportLimiter, authenticateToken, requireExportPermission, sanitizeInput, validateExportRequest, logExport, exportController.exportClientsToZip);

// POST /api/export/clients/zip/queue - Queue ZIP export job (admin+)
router.post('/clients/zip/queue', exportLimiter, authenticateToken, requireExportPermission, sanitizeInput, validateExportRequest, async (req, res) => {
  try {
    const { clientIds } = req.body;
    const userId = req.user?.id || 'anonymous';
    const startTime = Date.now();

    exportLogger.info('Queueing ZIP export job', {
      clientCount: clientIds.length,
      userId: userId,
      timestamp: new Date().toISOString()
    });

    const result = await addExportJob(clientIds, userId);

    const endTime = Date.now();
    const duration = endTime - startTime;

    exportLogger.info('ZIP export job queued', {
      clientCount: clientIds.length,
      jobId: result.jobId,
      duration: `${duration}ms`,
      userId: userId,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      data: result,
      message: 'Export job queued successfully'
    });
  } catch (error) {
    exportLogger.error('Failed to queue ZIP export job', {
      error: error.message,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: 'Failed to queue export job',
      message: error.message
    });
  }
});

// GET /api/export/status/:jobId - Check export job status
router.get('/status/:jobId', rateLimit, async (req, res) => {
  try {
    const { jobId } = req.params;
    const status = await getJobStatus(jobId);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get job status',
      message: error.message
    });
  }
});

// GET /api/export/download/:requestId - Download completed export
router.get('/download/:requestId', rateLimit, (req, res) => {
  try {
    const { requestId } = req.params;
    const filePath = path.join(__dirname, '../temp', `export_${requestId}.zip`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Export file not found'
      });
    }
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="clients_export_${requestId}.zip"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to download export',
      message: error.message
    });
  }
});

// Tymczasowy test endpoint do pobierania statycznego pliku PDF
router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../example.pdf');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Plik PDF nie istnieje' });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
  fs.createReadStream(filePath).pipe(res);
});

module.exports = router; 