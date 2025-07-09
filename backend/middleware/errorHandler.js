const { logger } = require('../config/logger');

// Middleware do obsługi błędów
const errorHandler = (err, req, res, next) => {
  const errorData = {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString()
  };

  // Log błędu
  logger.error('Application error', errorData);

  // Nie pokazuj stack trace w produkcji
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Określ status błędu
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Obsługa różnych typów błędów
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Response
  const response = {
    success: false,
    error: message,
    ...(isDevelopment && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};

// Middleware do obsługi 404
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Endpoint not found: ${req.method} ${req.url}`);
  error.statusCode = 404;
  next(error);
};

// Middleware do obsługi nieobsłużonych promise rejections
const unhandledRejectionHandler = (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason,
    timestamp: new Date().toISOString()
  });
};

// Middleware do obsługi nieobsłużonych exceptions
const uncaughtExceptionHandler = (error) => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  // Zamknij aplikację po zalogowaniu błędu
  process.exit(1);
};

// Middleware do monitoringu wydajności
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // w milisekundach
    
    const performanceData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      timestamp: new Date().toISOString(),
      userId: req.user?.id || 'anonymous'
    };

    // Log wolnych requestów
    if (duration > 1000) {
      logger.warn('Slow request detected', performanceData);
    }

    // Log bardzo wolnych requestów
    if (duration > 5000) {
      logger.error('Very slow request detected', performanceData);
    }
  });

  next();
};

module.exports = {
  errorHandler,
  notFoundHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler,
  performanceMonitor
}; 