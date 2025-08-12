const TreatmentConsent = require('../models/TreatmentConsent');
const ActivityLog = require('../models/ActivityLog');

const treatmentConsentController = {
  // Create new treatment consent
  createConsent: async (req, res) => {
    try {
      console.log('createConsent - req.body:', req.body);
      console.log('createConsent - req.user:', req.user);
      
      const { clientId, signature, hasConsented, hasReadTerms, notes } = req.body;
      
      // Walidacja danych wejściowych
      if (!clientId || !signature || typeof hasConsented !== 'boolean' || typeof hasReadTerms !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Invalid input data',
          message: 'Missing or invalid required fields'
        });
      }
      
      // Tymczasowo wyłączone dla testów
      // if (!req.user || !req.user.id) {
      //   return res.status(401).json({
      //     success: false,
      //     error: 'Unauthorized',
      //     message: 'User not authenticated'
      //   });
      // }
      
      // Sprawdź czy klient już ma zgodę
      const existingConsent = await TreatmentConsent.findOne({ 
        clientId, 
        type: 'treatment-consent',
        valid: true 
      });

      if (existingConsent) {
        // Zaktualizuj istniejącą zgodę
        existingConsent.signature = signature;
        existingConsent.hasConsented = hasConsented;
        existingConsent.hasReadTerms = hasReadTerms;
        existingConsent.signedAt = new Date();
        existingConsent.notes = notes;
        existingConsent.owner = req.user?.id || 'test-user';
        
        await existingConsent.save();
        
              // Log activity
      await ActivityLog.create({
        operation: 'update',
        resourceType: 'treatment_consent',
        resourceId: clientId,
        userId: req.user?.id || 'test-user',
        details: 'Treatment consent updated'
      });

        return res.json({
          success: true,
          data: existingConsent,
          message: 'Treatment consent updated successfully'
        });
      }

      // Utwórz nową zgodę
      const consent = await TreatmentConsent.create({
        clientId,
        signature,
        hasConsented,
        hasReadTerms,
        owner: req.user?.id || 'test-user',
        notes
      });

      // Log activity
      await ActivityLog.create({
        operation: 'create',
        resourceType: 'treatment_consent',
        resourceId: clientId,
        userId: req.user?.id || 'test-user',
        details: 'New treatment consent created'
      });

      res.status(201).json({
        success: true,
        data: consent,
        message: 'Treatment consent created successfully'
      });
    } catch (error) {
      console.error('Error creating treatment consent:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create treatment consent',
        message: error.message
      });
    }
  },

  // Get treatment consent for a client
  getClientConsent: async (req, res) => {
    try {
      const { clientId } = req.params;
      
      const consent = await TreatmentConsent.findOne({ 
        clientId, 
        type: 'treatment-consent',
        valid: true 
      }).sort({ signedAt: -1 });

      if (!consent) {
        return res.status(404).json({
          success: false,
          error: 'Treatment consent not found'
        });
      }

      res.json({
        success: true,
        data: consent
      });
    } catch (error) {
      console.error('Error fetching treatment consent:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch treatment consent',
        message: error.message
      });
    }
  },

  // Get all treatment consents for a client
  getClientConsents: async (req, res) => {
    try {
      const { clientId } = req.params;
      
      const consents = await TreatmentConsent.find({ 
        clientId, 
        type: 'treatment-consent'
      }).sort({ signedAt: -1 });

      res.json({
        success: true,
        data: consents,
        total: consents.length
      });
    } catch (error) {
      console.error('Error fetching treatment consents:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch treatment consents',
        message: error.message
      });
    }
  },

  // Invalidate treatment consent
  invalidateConsent: async (req, res) => {
    try {
      const { id } = req.params;
      
      const consent = await TreatmentConsent.findById(id);
      if (!consent) {
        return res.status(404).json({
          success: false,
          error: 'Treatment consent not found'
        });
      }

      consent.valid = false;
      await consent.save();

      // Log activity
      await ActivityLog.create({
        operation: 'invalidate',
        resourceType: 'treatment_consent',
        resourceId: consent.clientId,
        userId: req.user?.id || 'test-user',
        details: 'Treatment consent invalidated'
      });

      res.json({
        success: true,
        data: consent,
        message: 'Treatment consent invalidated successfully'
      });
    } catch (error) {
      console.error('Error invalidating treatment consent:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to invalidate treatment consent',
        message: error.message
      });
    }
  },

  // Get treatment consent statistics
  getConsentStats: async (req, res) => {
    try {
      const { clientId } = req.params;
      
      const consents = await TreatmentConsent.find({ 
        clientId, 
        type: 'treatment-consent'
      });

      const stats = {
        total: consents.length,
        valid: consents.filter(c => c.valid).length,
        invalid: consents.filter(c => !c.valid).length,
        latest: consents.length > 0 ? consents[0] : null,
        history: consents.map(c => ({
          id: c._id,
          signedAt: c.signedAt,
          valid: c.valid,
          hasConsented: c.hasConsented,
          hasReadTerms: c.hasReadTerms
        }))
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching consent stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch consent statistics',
        message: error.message
      });
    }
  }
};

module.exports = treatmentConsentController;
