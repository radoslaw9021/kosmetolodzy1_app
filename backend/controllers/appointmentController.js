const Appointment = require('../models/Appointment');
const logger = require('../config/logger');

// Pobierz wszystkie wizyty
exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, clientId, startDate, endDate } = req.query;
    
    const query = {};
    
    // Filtry
    if (status) query.status = status;
    if (clientId) query.clientId = clientId;
    if (startDate || endDate) {
      query.start = {};
      if (startDate) query.start.$gte = new Date(startDate);
      if (endDate) query.start.$lte = new Date(endDate);
    }
    
    const appointments = await Appointment.find(query)
      .populate('clientId', 'firstName lastName email')
      .sort({ start: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Appointment.countDocuments(query);
    
    res.json({
      appointments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
    
  } catch (error) {
    logger.error('Błąd podczas pobierania wizyt:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania wizyt' });
  }
};

// Pobierz wizytę po ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('clientId', 'firstName lastName email');
    
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    
    res.json(appointment);
    
  } catch (error) {
    logger.error('Błąd podczas pobierania wizyty:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania wizyty' });
  }
};

// Pobierz wizyty dla klienta
exports.getAppointmentsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status, limit = 100 } = req.query;
    
    const query = { clientId };
    if (status) query.status = status;
    
    const appointments = await Appointment.find(query)
      .sort({ start: -1 })
      .limit(parseInt(limit))
      .exec();
    
    res.json(appointments);
    
  } catch (error) {
    logger.error('Błąd podczas pobierania wizyt klienta:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania wizyt klienta' });
  }
};

// Utwórz nową wizytę
exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    
    // Sprawdź czy wizyta o tym ID już istnieje
    if (appointmentData.appointmentId) {
      const existingAppointment = await Appointment.findOne({ 
        appointmentId: appointmentData.appointmentId 
      });
      
      if (existingAppointment) {
        return res.status(400).json({ error: 'Wizyta o tym ID już istnieje' });
      }
    }
    
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    
    logger.info(`Utworzono nową wizytę: ${appointment._id}`);
    res.status(201).json(appointment);
    
  } catch (error) {
    logger.error('Błąd podczas tworzenia wizyty:', error);
    res.status(500).json({ error: 'Błąd serwera podczas tworzenia wizyty' });
  }
};

// Aktualizuj wizytę
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    
    logger.info(`Zaktualizowano wizytę: ${id}`);
    res.json(appointment);
    
  } catch (error) {
    logger.error('Błąd podczas aktualizacji wizyty:', error);
    res.status(500).json({ error: 'Błąd serwera podczas aktualizacji wizyty' });
  }
};

// Usuń wizytę
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByIdAndDelete(id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    
    logger.info(`Usunięto wizytę: ${id}`);
    res.json({ message: 'Wizyta została usunięta' });
    
  } catch (error) {
    logger.error('Błąd podczas usuwania wizyty:', error);
    res.status(500).json({ error: 'Błąd serwera podczas usuwania wizyty' });
  }
};

// Potwierdź wizytę (status: completed)
exports.confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'completed', updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    
    logger.info(`Potwierdzono wizytę: ${id}`);
    res.json(appointment);
    
  } catch (error) {
    logger.error('Błąd podczas potwierdzania wizyty:', error);
    res.status(500).json({ error: 'Błąd serwera podczas potwierdzania wizyty' });
  }
};

// Anuluj wizytę (status: cancelled)
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled', updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    
    logger.info(`Anulowano wizytę: ${id}`);
    res.json(appointment);
    
  } catch (error) {
    logger.error('Błąd podczas anulowania wizyty:', error);
    res.status(500).json({ error: 'Błąd serwera podczas anulowania wizyty' });
  }
};

// Zmień status wizyty
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Sprawdź czy status jest dozwolony
    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Nieprawidłowy status wizyty' });
    }
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    
    logger.info(`Zmieniono status wizyty ${id} na: ${status}`);
    res.json(appointment);
    
  } catch (error) {
    logger.error('Błąd podczas zmiany statusu wizyty:', error);
    res.status(500).json({ error: 'Błąd serwera podczas zmiany statusu wizyty' });
  }
};

// Pobierz wizytę po zewnętrznym ID (appointmentId)
exports.getAppointmentByExternalId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findOne({ appointmentId });
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    res.json(appointment);
  } catch (error) {
    logger.error('Błąd podczas pobierania wizyty (externalId):', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania wizyty' });
  }
};

// Potwierdź wizytę po zewnętrznym ID (status: completed)
exports.confirmAppointmentByExternalId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      { status: 'completed', updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    res.json(appointment);
  } catch (error) {
    logger.error('Błąd podczas potwierdzania wizyty (externalId):', error);
    res.status(500).json({ error: 'Błąd serwera podczas potwierdzania wizyty' });
  }
};

// Anuluj wizytę po zewnętrznym ID (status: cancelled)
exports.cancelAppointmentByExternalId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      { status: 'cancelled', updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    res.json(appointment);
  } catch (error) {
    logger.error('Błąd podczas anulowania wizyty (externalId):', error);
    res.status(500).json({ error: 'Błąd serwera podczas anulowania wizyty' });
  }
};

// Zmień status wizyty po zewnętrznym ID
exports.updateAppointmentStatusByExternalId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Nieprawidłowy status wizyty' });
    }
    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Wizyta nie została znaleziona' });
    }
    res.json(appointment);
  } catch (error) {
    logger.error('Błąd podczas zmiany statusu wizyty (externalId):', error);
    res.status(500).json({ error: 'Błąd serwera podczas zmiany statusu wizyty' });
  }
};
