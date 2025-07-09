const Signature = require('../models/Signature');
const ActivityLog = require('../models/ActivityLog');

const signatureController = {
  // Create new signature
  createSignature: async (req, res) => {
    try {
      let filePath, originalName;
      if (req.file) {
        filePath = req.file.filename;
        originalName = req.file.originalname;
      } else if (req.body.filePath) {
        filePath = req.body.filePath;
        originalName = req.body.originalName || '';
      } else {
        return res.status(400).json({ success: false, error: 'No signature file provided' });
      }
      const { clientId, type, valid, signedAt } = req.body;
      const signature = await Signature.create({
        clientId,
        type,
        filePath,
        originalName,
        valid: valid !== undefined ? valid : true,
        signedAt: signedAt || Date.now()
      });
      res.status(201).json({ success: true, data: signature });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create signature', message: error.message });
    }
  },

  // Get signatures for a client
  getClientSignatures: async (req, res) => {
    try {
      const { clientId } = req.params;
      const { type } = req.query;
      let filter = { clientId };
      if (type) {
        filter.type = type;
      }
      const clientSignatures = await Signature.find(filter).sort({ createdAt: -1 });
      res.json({
        success: true,
        data: clientSignatures,
        total: clientSignatures.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch signatures',
        message: error.message
      });
    }
  },

  // Get signature by ID
  getSignatureById: async (req, res) => {
    try {
      const { id } = req.params;
      const signature = await Signature.findById(id);
      if (!signature) {
        return res.status(404).json({
          success: false,
          error: 'Signature not found'
        });
      }
      res.json({
        success: true,
        data: signature
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch signature',
        message: error.message
      });
    }
  },

  // Validate signature
  validateSignature: async (req, res) => {
    try {
      const { id } = req.params;
      const signature = await Signature.findById(id);
      if (!signature) {
        return res.status(404).json({
          success: false,
          error: 'Signature not found'
        });
      }
      res.json({
        success: true,
        data: {
          id: signature._id,
          isValid: signature.valid,
          signedAt: signature.signedAt,
          type: signature.type,
          clientId: signature.clientId
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to validate signature',
        message: error.message
      });
    }
  },

  // Invalidate signature
  invalidateSignature: async (req, res) => {
    try {
      const { id } = req.params;
      const signature = await Signature.findById(id);
      if (!signature) {
        return res.status(404).json({
          success: false,
          error: 'Signature not found'
        });
      }
      signature.valid = false;
      await signature.save();
      res.json({
        success: true,
        data: signature,
        message: 'Signature invalidated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to invalidate signature',
        message: error.message
      });
    }
  },

  // Get signature statistics
  getSignatureStats: async (req, res) => {
    try {
      const { clientId } = req.params;
      
      const clientSignatures = await Signature.find({ clientId });
      
      const stats = {
        total: clientSignatures.length,
        valid: clientSignatures.filter(sig => sig.valid).length,
        expired: clientSignatures.filter(sig => !sig.valid).length,
        invalid: clientSignatures.filter(sig => !sig.valid).length,
        byType: {
          consent: clientSignatures.filter(sig => sig.type === 'consent').length,
          medical: clientSignatures.filter(sig => sig.type === 'medical').length,
          photo: clientSignatures.filter(sig => sig.type === 'photo').length
        }
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch signature statistics',
        message: error.message
      });
    }
  }
};

module.exports = signatureController; 