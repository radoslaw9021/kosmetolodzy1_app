const Treatment = require('../models/Treatment');
const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');
const mongoose = require('mongoose');

const treatmentController = {
  // Dodaj nowy zabieg
  addTreatment: async (req, res) => {
    try {
      const { clientId, type, date, notesInternal, notesForClient, recommendations, images } = req.body;
      
      if (!clientId || !type || !date) {
        return res.status(400).json({
          success: false,
          error: 'clientId, type i date są wymagane'
        });
      }

      // Sprawdź czy klient istnieje
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      // Sprawdź uprawnienia
      if (req.user.role === 'cosmetologist' && client.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      // Utwórz nowy zabieg
      const newTreatment = await Treatment.create({
        clientId: clientId,
        type,
        date: new Date(date),
        notesInternal,
        notesForClient,
        recommendations: recommendations || [],
        images: images || [],
        owner: req.user._id
      });

      // Dodaj zabieg do klienta
      await Client.findByIdAndUpdate(
        clientId,
        { $push: { treatments: newTreatment._id } }
      );

      // Log aktywności
      const log = new ActivityLog({
        operation: 'create',
        resourceType: 'treatment',
        resourceId: newTreatment._id.toString(),
        userId: req.user._id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: `Added treatment: ${type} for client ${client.firstName} ${client.lastName}`
      });
      await log.save();

      res.status(201).json({
        success: true,
        data: newTreatment,
        message: 'Treatment added successfully'
      });
    } catch (error) {
      console.error('❌ Błąd dodawania zabiegu:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add treatment',
        message: error.message
      });
    }
  },

  // Pobierz zabiegi dla klienta
  getTreatmentsForClient: async (req, res) => {
    try {
      const { clientId } = req.params;
      
      // Konwertuj string na ObjectId
      const clientObjectId = mongoose.Types.ObjectId.isValid(clientId) 
        ? new mongoose.Types.ObjectId(clientId) 
        : clientId;
      
      // Sprawdź czy klient istnieje
      const client = await Client.findById(clientObjectId);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      // Sprawdź uprawnienia
      if (req.user.role === 'cosmetologist' && client.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const treatments = await Treatment.find({ clientId: clientObjectId })
        .sort({ date: -1 })
        .populate('owner', 'firstName lastName');

      res.json({
        success: true,
        data: treatments,
        total: treatments.length
      });
    } catch (error) {
      console.error('❌ Błąd pobierania zabiegów:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get treatments',
        message: error.message
      });
    }
  },

  // Aktualizuj zabieg
  updateTreatment: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, date, notesInternal, notesForClient, recommendations, images } = req.body;

      const treatment = await Treatment.findById(id);
      if (!treatment) {
        return res.status(404).json({
          success: false,
          error: 'Treatment not found'
        });
      }

      // Sprawdź uprawnienia
      if (req.user.role === 'cosmetologist' && treatment.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const updatedTreatment = await Treatment.findByIdAndUpdate(
        id,
        {
          type,
          date: new Date(date),
          notesInternal,
          notesForClient,
          recommendations: recommendations || [],
          images: images || []
        },
        { new: true, runValidators: true }
      );

      // Log aktywności
      const log = new ActivityLog({
        operation: 'update',
        resourceType: 'treatment',
        resourceId: treatment._id.toString(),
        userId: req.user._id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: `Updated treatment: ${updatedTreatment.type}`
      });
      await log.save();

      res.json({
        success: true,
        data: updatedTreatment,
        message: 'Treatment updated successfully'
      });
    } catch (error) {
      console.error('❌ Błąd aktualizacji zabiegu:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update treatment',
        message: error.message
      });
    }
  },

  // Usuń zabieg
  deleteTreatment: async (req, res) => {
    try {
      const { id } = req.params;

      const treatment = await Treatment.findById(id);
      if (!treatment) {
        return res.status(404).json({
          success: false,
          error: 'Treatment not found'
        });
      }

      // Sprawdź uprawnienia
      if (req.user.role === 'cosmetologist' && treatment.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      // Usuń zabieg z klienta
      await Client.findByIdAndUpdate(
        treatment.clientId,
        { $pull: { treatments: treatment._id } }
      );

      // Usuń zabieg
      await Treatment.findByIdAndDelete(id);

      // Log aktywności
      const log = new ActivityLog({
        operation: 'delete',
        resourceType: 'treatment',
        resourceId: treatment._id.toString(),
        userId: req.user._id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: `Deleted treatment: ${treatment.type}`
      });
      await log.save();

      res.json({
        success: true,
        message: 'Treatment deleted successfully'
      });
    } catch (error) {
      console.error('❌ Błąd usuwania zabiegu:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete treatment',
        message: error.message
      });
    }
  }
};

module.exports = treatmentController; 