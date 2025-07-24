const { requirePermission } = require('./auth');

// Middleware sprawdzający uprawnienia do eksportu zbiorczego
const requireExportPermission = (req, res, next) => {
  // Sprawdź czy użytkownik ma uprawnienie do eksportu
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required for export operations'
    });
  }

  // Admin ma wszystkie uprawnienia
  if (req.user.role === 'admin') {
    return next();
  }

  // Sprawdź konkretne uprawnienia
  const requiredPermissions = ['export_bulk', 'export_zip'];
  const hasPermission = requiredPermissions.some(permission => 
    req.user.permissions.includes(permission)
  );

  if (!hasPermission) {
    return res.status(403).json({
      success: false,
      error: 'Export permission required. Contact administrator for access.'
    });
  }

  // Sprawdź limit eksportów dla nie-adminów
  const exportCount = req.user.exportCount || 0;
  const maxExports = req.user.role === 'pracownik' ? 5 : 2; // pracownik: 5, gość: 2

  if (exportCount >= maxExports) {
    return res.status(429).json({
      success: false,
      error: `Export limit reached. Maximum ${maxExports} exports per day.`
    });
  }

  next();
};

// Middleware sprawdzający uprawnienia do eksportu pojedynczego klienta
const requireSingleExportPermission = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  // Admin i pracownik mogą eksportować pojedynczych klientów
  if (['admin', 'pracownik'].includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Insufficient permissions for single client export'
  });
};

// Middleware do logowania eksportów
const logExport = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Loguj eksport tylko jeśli był udany
    if (res.statusCode === 200 && req.user) {
      const ActivityLog = require('../models/ActivityLog');
      
      const log = new ActivityLog({
        operation: 'export',
        resourceType: 'client',
        resourceId: (req.body.clientIds || [req.params.clientId]).join(','),
        userId: req.user._id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: { 
          format: req.path.includes('zip') ? 'zip' : 'pdf',
          clientCount: (req.body.clientIds || [req.params.clientId]).length
        }
      });
      log.save().catch(err => console.error('Failed to log export:', err));
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = {
  requireExportPermission,
  requireSingleExportPermission,
  logExport
}; 