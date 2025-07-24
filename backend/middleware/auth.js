const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Client = require('../models/Client');
const Treatment = require('../models/Treatment');
const Signature = require('../models/Signature');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware do weryfikacji JWT tokena
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or inactive user'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Middleware sprawdzający rolę admina
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  if (!req.user.isAdmin()) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  
  next();
};

// Middleware sprawdzający konkretne uprawnienie
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        error: `Permission '${permission}' required`
      });
    }
    
    next();
  };
};

// Middleware sprawdzający rolę (admin lub cosmetologist)
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Role required: ${roles.join(', ')}`
      });
    }
    
    next();
  };
};

// Sprawdź czy użytkownik ma dostęp do zasobu
const checkResourceOwnership = async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const resourceType = req.baseUrl.split('/').pop(); // 'clients', 'treatments', etc.
    
    let resource;
    
    switch (resourceType) {
      case 'clients':
        resource = await Client.findById(resourceId);
        break;
      case 'treatments':
        resource = await Treatment.findById(resourceId);
        break;
      case 'signatures':
        resource = await Signature.findById(resourceId);
        break;
      default:
        return res.status(400).json({ 
          success: false,
          error: 'Invalid resource type' 
        });
    }
    
    if (!resource) {
      return res.status(404).json({ 
        success: false,
        error: 'Resource not found' 
      });
    }
    
    // Admin ma dostęp do wszystkiego
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Cosmetologist może edytować tylko swoje zasoby
    if (resource.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied' 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Generowanie tokena JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requirePermission,
  requireRole,
  checkResourceOwnership,
  generateToken
}; 