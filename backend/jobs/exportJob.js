const { exportQueue } = require('../config/queue');
const Client = require('../models/Client');
const Signature = require('../models/Client');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Job do przetwarzania eksportu ZIP
const processExportJob = async (job) => {
  const { clientIds, userId, requestId } = job.data;
  
  try {
    // Aktualizuj status na "processing"
    job.progress(10);
    
    // Pobierz dane klientów
    const clients = await Client.find({ _id: { $in: clientIds } });
    job.progress(30);
    
    if (clients.length === 0) {
      throw new Error('No clients found');
    }
    
    // Utwórz plik ZIP
    const outputPath = path.join(__dirname, '../temp', `export_${requestId}.zip`);
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    
    // Dodaj dane klientów
    const clientsData = clients.map(client => ({
      id: client._id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      archived: client.archived,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    }));
    
    archive.append(JSON.stringify(clientsData, null, 2), { name: 'clients_data.json' });
    job.progress(50);
    
    // Dodaj pliki podpisów
    for (const client of clients) {
      const signatures = await Signature.find({ clientId: client._id, valid: true });
      
      if (signatures.length > 0) {
        const clientFolder = `signatures/${client.firstName}_${client.lastName}_${client._id}`;
        
        for (const signature of signatures) {
          const signaturePath = path.join(__dirname, '../uploads/signatures', signature.filePath);
          
          if (fs.existsSync(signaturePath)) {
            const fileName = `${clientFolder}/${signature.type}_${signature.signedAt.toISOString().split('T')[0]}.${signature.originalName.split('.').pop() || 'png'}`;
            archive.file(signaturePath, { name: fileName });
          }
        }
        
        // Metadane podpisów
        const signaturesData = signatures.map(sig => ({
          type: sig.type,
          signedAt: sig.signedAt,
          valid: sig.valid,
          originalName: sig.originalName
        }));
        archive.append(JSON.stringify(signaturesData, null, 2), { name: `${clientFolder}/signatures_metadata.json` });
      }
    }
    
    job.progress(80);
    
    // Finalizuj archiwum
    await archive.finalize();
    
    // Czekaj na zakończenie zapisu
    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
    });
    
    job.progress(100);
    
    return {
      success: true,
      filePath: outputPath,
      fileName: `clients_export_${requestId}.zip`,
      size: archive.pointer()
    };
    
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
};

// Dodaj job do kolejki
const addExportJob = async (clientIds, userId) => {
  const requestId = Date.now().toString();
  
  const job = await exportQueue.add('export-zip', {
    clientIds,
    userId,
    requestId
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
  
  return {
    jobId: job.id,
    requestId,
    status: 'queued'
  };
};

// Sprawdź status joba
const getJobStatus = async (jobId) => {
  const job = await exportQueue.getJob(jobId);
  
  if (!job) {
    return { status: 'not_found' };
  }
  
  const state = await job.getState();
  const progress = job._progress;
  
  return {
    jobId: job.id,
    status: state,
    progress,
    data: job.data
  };
};

module.exports = {
  processExportJob,
  addExportJob,
  getJobStatus
}; 