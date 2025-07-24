const ActivityLog = require('../models/ActivityLog');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');
const archiver = require('archiver');

// Generowanie PDF z danymi klientów
const generatePDF = async (data, type) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve({
        filename: `${type}_${Date.now()}.pdf`,
        content: pdfBuffer,
        size: pdfBuffer.length
      });
    });
    doc.on('error', reject);

    // Nagłówek
    doc.fontSize(20).text(`Eksport klientów: ${type}`, { align: 'center' });
    doc.moveDown(2);

    if (Array.isArray(data)) {
      // Eksport zbiorczy - lista klientów
      data.forEach((client, index) => {
        doc.fontSize(16).text(`Klient ${index + 1}: ${client.personalData.firstName} ${client.personalData.lastName}`);
        doc.fontSize(12).text(`Email: ${client.personalData.email}`);
        doc.fontSize(12).text(`Telefon: ${client.personalData.phone || 'Brak'}`);
        doc.fontSize(12).text(`Data urodzenia: ${client.personalData.birthDate ? new Date(client.personalData.birthDate).toLocaleDateString('pl-PL') : 'Brak'}`);
        doc.fontSize(12).text(`Płeć: ${client.personalData.gender || 'Brak'}`);
        doc.fontSize(12).text(`Adres: ${client.personalData.address || 'Brak'}`);
        
        if (client.medical) {
          doc.moveDown(0.5);
          doc.fontSize(12).text('Dane medyczne:');
          doc.fontSize(10).text(`Choroby przewlekłe: ${client.medical.chronicDiseases || 'Brak'}`);
          doc.fontSize(10).text(`Leki: ${client.medical.medications || 'Brak'}`);
          doc.fontSize(10).text(`Suplementy: ${client.medical.supplements || 'Brak'}`);
          doc.fontSize(10).text(`Alergie: ${client.medical.allergies || 'Brak'}`);
        }
        
        if (client.consents) {
          doc.moveDown(0.5);
          doc.fontSize(12).text('Zgody:');
          doc.fontSize(10).text(`RODO: ${client.consents.rodo ? 'Tak' : 'Nie'}`);
          doc.fontSize(10).text(`Marketing: ${client.consents.marketing ? 'Tak' : 'Nie'}`);
          doc.fontSize(10).text(`Newsletter: ${client.consents.newsletter ? 'Tak' : 'Nie'}`);
          doc.fontSize(10).text(`Zdjęcia: ${client.consents.image ? 'Tak' : 'Nie'}`);
        }
        
        if (client.notes) {
          doc.moveDown(0.5);
          doc.fontSize(12).text('Notatki:');
          doc.fontSize(10).text(client.notes);
        }
        
        doc.moveDown(2);
        if (index < data.length - 1) {
          doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
          doc.moveDown(1);
        }
      });
    } else {
      // Pojedynczy klient
      doc.fontSize(16).text(`${data.personalData.firstName} ${data.personalData.lastName}`);
      doc.fontSize(12).text(`Email: ${data.personalData.email}`);
      doc.fontSize(12).text(`Telefon: ${data.personalData.phone || 'Brak'}`);
    }

    doc.end();
  });
};

// Prawdziwe generowanie ZIP z PDF-ami
const generateZIP = async (files, res) => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    let buffers = [];
    archive.on('data', buffers.push.bind(buffers));
    archive.on('error', reject);
    archive.on('end', () => {
      const zipBuffer = Buffer.concat(buffers);
      resolve({
        filename: `export_${Date.now()}.zip`,
        content: zipBuffer,
        size: zipBuffer.length
      });
    });
    // Dodaj każdy plik PDF do archiwum
    files.forEach(file => {
      archive.append(file.content, { name: file.filename });
    });
    archive.finalize();
  });
};

const exportController = {
  // Export single client data to PDF
  exportClientPDF: async (req, res) => {
    try {
      const { clientId } = req.params;
      const { includeTreatments, includeSignatures } = req.query;

      // In real implementation, fetch client data from database
      const clientData = {
        id: clientId,
        personalData: {
          firstName: 'Sample',
          lastName: 'Client',
          email: 'sample@email.com'
        },
        consents: {
          marketing: true,
          medical: true
        },
        treatments: includeTreatments === 'true' ? [
          { name: 'Facial Treatment', date: '2024-01-15' }
        ] : [],
        signatures: includeSignatures === 'true' ? [
          { type: 'consent', signedAt: '2024-01-10' }
        ] : []
      };

      const pdf = await generatePDF(clientData, 'client');

      // Log export
      const log = new ActivityLog({
        operation: 'export',
        resourceType: 'client',
        resourceId: clientId,
        userId: req.user?.id || 'anonymous',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: { format: 'pdf' }
      });
      await log.save();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
      res.end(pdf.content);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate PDF',
        message: error.message
      });
    }
  },

  // Bulk export multiple clients
  bulkExport: async (req, res) => {
    try {
      const { clientIds, format, includeTreatments, includeSignatures } = req.body;

      if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'clientIds array is required and must not be empty'
        });
      }

      if (!['pdf', 'zip'].includes(format)) {
        return res.status(400).json({
          success: false,
          error: 'format must be either "pdf" or "zip"'
        });
      }

      // Pobierz rzeczywiste dane klientów z bazy danych
      const Client = require('../models/Client');
      const clients = await Client.find({ _id: { $in: clientIds } });
      
      if (clients.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No clients found'
        });
      }
      
      const clientsData = clients.map(client => ({
        id: client._id,
        personalData: {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          birthDate: client.birthDate,
          gender: client.gender,
          address: client.address
        },
        medical: client.medical,
        consents: client.consents,
        notes: client.notes,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
      }));

      let exportResult;

      if (format === 'pdf') {
        // Generate single PDF with all clients
        exportResult = await generatePDF(clientsData, 'bulk_clients');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
        res.end(exportResult.content);
      } else if (format === 'zip') {
        // Generate individual PDFs and zip them
        const pdfFiles = await Promise.all(
          clientsData.map(client => generatePDF(client, 'client'))
        );
        const zipResult = await generateZIP(pdfFiles, res);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipResult.filename}"`);
        res.end(zipResult.content);
      }

      // Log bulk export
      const log = new ActivityLog({
        operation: 'export',
        resourceType: 'client',
        resourceId: clientIds.join(','),
        userId: req.user?.id || 'anonymous',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: { format, clientCount: clientIds.length }
      });
      await log.save();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate bulk export',
        message: error.message
      });
    }
  },

  // Export consent form template
  exportConsentTemplate: async (req, res) => {
    try {
      const { type } = req.params; // consent, medical, photo
      
      const validTypes = ['consent', 'medical', 'photo'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid consent type'
        });
      }

      const templateData = {
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Consent Form`,
        content: `This is a template for ${type} consent form.`,
        fields: [
          'Client Name',
          'Date of Birth',
          'Signature',
          'Date',
          'Witness'
        ]
      };

      const pdf = await generatePDF(templateData, `consent_${type}`);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
      res.end(pdf.content);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate consent template',
        message: error.message
      });
    }
  },

  // Export treatment history
  exportTreatmentHistory: async (req, res) => {
    try {
      const { clientId } = req.params;
      const { dateFrom, dateTo } = req.query;

      // In real implementation, fetch treatment history from database
      const treatmentHistory = {
        clientId,
        clientName: 'Sample Client',
        dateRange: { from: dateFrom, to: dateTo },
        treatments: [
          {
            name: 'Facial Treatment',
            date: '2024-01-15',
            duration: 60,
            price: 150,
            notes: 'Deep cleansing facial'
          },
          {
            name: 'Chemical Peel',
            date: '2024-01-22',
            duration: 45,
            price: 200,
            notes: 'Light chemical peel for acne scars'
          }
        ],
        totalTreatments: 2,
        totalValue: 350
      };

      const pdf = await generatePDF(treatmentHistory, 'treatment_history');

      // Log export
      const log = new ActivityLog({
        operation: 'export',
        resourceType: 'treatment',
        resourceId: clientId,
        userId: req.user?.id || 'anonymous',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: { format: 'pdf' }
      });
      await log.save();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
      res.end(pdf.content);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate treatment history',
        message: error.message
      });
    }
  },

  // Get export statistics
  getExportStats: (req, res) => {
    try {
      // In real implementation, fetch from database
      const stats = {
        totalExports: 25,
        exportsThisMonth: 8,
        mostExportedFormat: 'pdf',
        averageFileSize: 2048, // bytes
        exportsByType: {
          client: 15,
          treatment: 7,
          consent: 3
        }
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch export statistics',
        message: error.message
      });
    }
  },

  // Export multiple clients to ZIP with signatures
  exportClientsToZip: async (req, res) => {
    try {
      const { clientIds } = req.body;
      
      if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'clientIds array is required and must not be empty'
        });
      }

      const Client = require('../models/Client');
      const Signature = require('../models/Signature');
      const fs = require('fs');
      const path = require('path');

      // Pobierz dane klientów z bazy
      const clients = await Client.find({ _id: { $in: clientIds } });
      
      if (clients.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No clients found'
        });
      }

      // Ustaw nagłówki dla ZIP
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="clients_export_${Date.now()}.zip"`);

      // Utwórz archiver stream
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(res);

      // Dodaj dane klientów jako JSON
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

      // Dodaj pliki podpisów dla każdego klienta
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
          
          // Dodaj metadane podpisów jako JSON
          const signaturesData = signatures.map(sig => ({
            type: sig.type,
            signedAt: sig.signedAt,
            valid: sig.valid,
            originalName: sig.originalName
          }));
          archive.append(JSON.stringify(signaturesData, null, 2), { name: `${clientFolder}/signatures_metadata.json` });
        }
      }

      // Finalizuj archiwum
      await archive.finalize();

      // Log export
      const log = new ActivityLog({
        operation: 'export',
        resourceType: 'client',
        resourceId: clientIds.join(','),
        userId: req.user?.id || 'anonymous',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: { format: 'zip', clientCount: clientIds.length }
      });
      await log.save();

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate ZIP export',
        message: error.message
      });
    }
  }
};

module.exports = exportController; 