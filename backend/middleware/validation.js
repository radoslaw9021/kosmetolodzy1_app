// Validation middleware for request data
const validateClientData = (req, res, next) => {
  const { firstName, lastName, email, phone } = req.body;

  const errors = [];

  // Required fields validation
  if (!firstName || firstName.trim().length === 0) {
    errors.push('firstName is required');
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push('lastName is required');
  }

  if (!email || email.trim().length === 0) {
    errors.push('email is required');
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('email must be a valid email address');
  }

  // Phone format validation (basic)
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
  if (phone && !phoneRegex.test(phone)) {
    errors.push('phone must be a valid phone number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

const validateSignatureData = (req, res, next) => {
  const { clientId, type, signatureData } = req.body;

  const errors = [];

  if (!clientId) {
    errors.push('clientId is required');
  }

  if (!type) {
    errors.push('type is required');
  } else {
    const validTypes = ['consent', 'treatment', 'medical'];
    if (!validTypes.includes(type)) {
      errors.push('type must be one of: consent, treatment, medical');
    }
  }

  if (!signatureData) {
    errors.push('signatureData is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

const validateConsentData = (req, res, next) => {
  const { clientId, signature, hasConsented, hasReadTerms } = req.body;

  const errors = [];

  if (!clientId) {
    errors.push('clientId is required');
  }

  if (!signature) {
    errors.push('signature is required');
  }

  if (typeof hasConsented !== 'boolean') {
    errors.push('hasConsented must be a boolean');
  }

  if (typeof hasReadTerms !== 'boolean') {
    errors.push('hasReadTerms must be a boolean');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

const validateExportRequest = (req, res, next) => {
  const { clientIds, format } = req.body;

  const errors = [];

  if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
    errors.push('clientIds must be a non-empty array');
  }

  if (!format) {
    errors.push('format is required');
  } else {
    const validFormats = ['pdf', 'zip'];
    if (!validFormats.includes(format)) {
      errors.push('format must be one of: pdf, zip');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Sanitize input data
const sanitizeInput = (req, res, next) => {
  // Sanitize string fields
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
};

// Rate limiting (basic implementation)
const rateLimit = (req, res, next) => {
  // In real implementation, use Redis or similar for rate limiting
  // This is a simple in-memory rate limiter
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // max 100 requests per window

  // This would be stored in Redis in production
  if (!req.app.locals.rateLimit) {
    req.app.locals.rateLimit = {};
  }

  if (!req.app.locals.rateLimit[clientIP]) {
    req.app.locals.rateLimit[clientIP] = {
      count: 0,
      resetTime: now + windowMs
    };
  }

  const rateLimitData = req.app.locals.rateLimit[clientIP];

  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 0;
    rateLimitData.resetTime = now + windowMs;
  }

  rateLimitData.count++;

  if (rateLimitData.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  }

  next();
};

module.exports = {
  validateClientData,
  validateSignatureData,
  validateConsentData,
  validateExportRequest,
  sanitizeInput,
  rateLimit
}; 