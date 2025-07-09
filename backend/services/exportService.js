const { exportLogger } = require('../config/logger');

// Funkcja do eksportu klientów do ZIP
async function exportClientsToZip(clientIds, userId) {
  const startTime = Date.now();
  
  try {
    exportLogger.info('Starting ZIP export process', {
      clientCount: clientIds.length,
      userId,
      timestamp: new Date().toISOString()
    });

    // ... istniejący kod ...

    const endTime = Date.now();
    const duration = endTime - startTime;

    exportLogger.info('ZIP export process completed', {
      clientCount: clientIds.length,
      duration: `${duration}ms`,
      fileSize: `${(archive.pointer() / 1024 / 1024).toFixed(2)}MB`,
      userId,
      timestamp: new Date().toISOString()
    });

    return archive;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    exportLogger.error('ZIP export process failed', {
      error: error.message,
      stack: error.stack,
      clientCount: clientIds.length,
      duration: `${duration}ms`,
      userId,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
}

// Funkcja do dodawania zadania eksportu do kolejki
async function addExportJob(clientIds, userId) {
  const startTime = Date.now();

  try {
    exportLogger.info('Adding export job to queue', {
      clientCount: clientIds.length,
      userId,
      timestamp: new Date().toISOString()
    });

    // ... istniejący kod ...

    const endTime = Date.now();
    const duration = endTime - startTime;

    exportLogger.info('Export job added to queue', {
      clientCount: clientIds.length,
      jobId: job.id,
      duration: `${duration}ms`,
      userId,
      timestamp: new Date().toISOString()
    });

    return { jobId: job.id, status: 'queued' };
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    exportLogger.error('Failed to add export job to queue', {
      error: error.message,
      stack: error.stack,
      clientCount: clientIds.length,
      duration: `${duration}ms`,
      userId,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
}

// ... istniejący kod ... 