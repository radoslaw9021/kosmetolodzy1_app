const Queue = require('bull');

// Konfiguracja kolejki eksportu
const exportQueue = new Queue('export-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
    lazyConnect: true
  }
});

// Obsługa błędów połączenia z Redis
exportQueue.on('error', (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.warn('⚠️ Redis niedostępne - kolejka eksportu nie działa');
  } else {
    console.error('❌ Błąd kolejki eksportu:', error.message);
  }
});

// Funkcja do dodawania zadań eksportu
async function addExportJob(clientIds, userId) {
  try {
    const job = await exportQueue.add('export-clients', {
      clientIds,
      userId,
      timestamp: new Date().toISOString()
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });

    return { jobId: job.id, status: 'queued' };
  } catch (error) {
    console.error('❌ Błąd dodawania zadania eksportu:', error.message);
    throw new Error('Nie udało się dodać zadania eksportu');
  }
}

// Funkcja do sprawdzania statusu zadania
async function getJobStatus(jobId) {
  try {
    const job = await exportQueue.getJob(jobId);
    if (!job) {
      return { status: 'not_found' };
    }

    const state = await job.getState();
    const progress = job._progress;
    const result = job.returnvalue;

    return {
      status: state,
      progress: progress || 0,
      result: result || null,
      error: job.failedReason || null
    };
  } catch (error) {
    console.error('❌ Błąd sprawdzania statusu zadania:', error.message);
    return { status: 'error', error: error.message };
  }
}

// Przetwarzanie zadań eksportu
exportQueue.process('export-clients', async (job) => {
  try {
    const { clientIds, userId } = job.data;
    
    console.log(`🔄 Przetwarzanie eksportu dla ${clientIds.length} klientów...`);
    
    // Symulacja przetwarzania
    for (let i = 0; i <= 100; i += 10) {
      await job.progress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Eksport zakończony dla ${clientIds.length} klientów`);
    
    return {
      success: true,
      clientCount: clientIds.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Błąd przetwarzania eksportu:', error.message);
    throw error;
  }
});

// Eksport funkcji
module.exports = {
  addExportJob,
  getJobStatus,
  exportQueue
}; 