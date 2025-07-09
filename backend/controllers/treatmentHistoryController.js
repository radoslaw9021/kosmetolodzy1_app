const TreatmentHistory = require('../models/TreatmentHistory');

const treatmentHistoryController = {
  // Dodaj nowy zabieg
  addTreatment: async (req, res) => {
    try {
      const { clientId, treatmentName, date, description, performedBy, notes } = req.body;
      if (!clientId || !treatmentName || !date) {
        return res.status(400).json({
          success: false,
          error: 'clientId, treatmentName i date są wymagane'
        });
      }
      const newTreatment = await TreatmentHistory.create({
        clientId,
        treatmentName,
        date,
        description,
        performedBy,
        notes
      });
      res.status(201).json({
        success: true,
        data: newTreatment,
        message: 'Zabieg dodany pomyślnie'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Błąd podczas dodawania zabiegu',
        message: error.message
      });
    }
  },

  // Pobierz historię zabiegów dla klientki
  getTreatmentsForClient: async (req, res) => {
    try {
      const { clientId } = req.params;
      const treatments = await TreatmentHistory.find({ clientId }).sort({ date: -1 });
      res.json({
        success: true,
        data: treatments,
        total: treatments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Błąd podczas pobierania historii zabiegów',
        message: error.message
      });
    }
  }
};

module.exports = treatmentHistoryController; 