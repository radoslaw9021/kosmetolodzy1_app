const express = require('express');
const router = express.Router();
const signatureController = require('../controllers/signatureController');
const { validateSignatureData, sanitizeInput, rateLimit } = require('../middleware/validation');
const multer = require('multer');
const path = require('path');
const { uploadLimiter } = require('../middleware/rateLimiter');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/signatures'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // tylko 1 plik na raz
  },
  fileFilter: (req, file, cb) => {
    // Sprawdź typ pliku
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed.'), false);
    }
  }
});

// POST /api/signatures - Create new signature
router.post('/', rateLimit, sanitizeInput, validateSignatureData, signatureController.createSignature);

// GET /api/signatures/client/:clientId - Get signatures for a client
router.get('/client/:clientId', rateLimit, signatureController.getClientSignatures);

// GET /api/signatures/client/:clientId/stats - Get signature statistics for client
router.get('/client/:clientId/stats', rateLimit, signatureController.getSignatureStats);

// GET /api/signatures/:id/validate - Validate signature
router.get('/:id/validate', rateLimit, signatureController.validateSignature);

// POST /api/signatures/:id/invalidate - Invalidate signature
router.post('/:id/invalidate', rateLimit, signatureController.invalidateSignature);

// Upload pliku podpisu
router.post('/upload', uploadLimiter, upload.single('signature'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  res.json({ success: true, filename: req.file.filename, path: `/api/signatures/file/${req.file.filename}` });
}, (error, req, res, next) => {
  // Obsługa błędów Multer
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        error: 'File too large. Maximum size is 10MB.' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        success: false, 
        error: 'Too many files. Only one file allowed.' 
      });
    }
  }
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
  res.status(500).json({ 
    success: false, 
    error: 'Upload failed', 
    message: error.message 
  });
});

// Pobieranie pliku podpisu
router.get('/file/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/signatures', req.params.filename);
  res.sendFile(filePath);
});

// GET /api/signatures/:id - Get signature by ID (must be last)
router.get('/:id', rateLimit, signatureController.getSignatureById);

module.exports = router; 