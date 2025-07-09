const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');

const clientController = {
  // Get all clients (with optional filtering)
  getAllClients: async (req, res) => {
    try {
      let { archived, search, page = 1, limit = 20, sort = '-createdAt', owner, dateFrom, dateTo } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      let filter = {};
      if (archived !== undefined) {
        filter.archived = archived === 'true';
      }
      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
          { phone: regex }
        ];
      }
      if (owner) {
        filter.owner = owner;
      }
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo);
      }
      const total = await Client.countDocuments(filter);
      const clients = await Client.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
      res.json({
        success: true,
        data: clients,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch clients',
        message: error.message
      });
    }
  },

  // Get single client by ID
  getClientById: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await Client.findById(id);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }
      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch client',
        message: error.message
      });
    }
  },

  // Create new client
  createClient: async (req, res) => {
    try {
      const clientData = req.body;
      const newClient = await Client.create(clientData);
      res.status(201).json({
        success: true,
        data: newClient,
        message: 'Client created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create client',
        message: error.message
      });
    }
  },

  // Update client
  updateClient: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedClient = await Client.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedClient) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }
      res.json({
        success: true,
        data: updatedClient,
        message: 'Client updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update client',
        message: error.message
      });
    }
  },

  // Archive client
  archiveClient: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await Client.findById(id);
      
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      client.archived = true;
      await client.save();

      // Log archiving
      const log = ActivityLog.createDeletionLog(
        req.user?.id || 'anonymous',
        'client',
        id,
        req.ip,
        req.get('User-Agent')
      );
      // activityLogs.push(log); // This line is removed as per the new_code

      res.json({
        success: true,
        data: client,
        message: 'Client archived successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to archive client',
        message: error.message
      });
    }
  },

  // Unarchive client
  unarchiveClient: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await Client.findById(id);
      
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      client.archived = false;
      await client.save();

      // Log unarchiving
      const log = ActivityLog.createModificationLog(
        req.user?.id || 'anonymous',
        'client',
        id,
        { action: 'unarchive' },
        req.ip,
        req.get('User-Agent')
      );
      // activityLogs.push(log); // This line is removed as per the new_code

      res.json({
        success: true,
        data: client,
        message: 'Client unarchived successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to unarchive client',
        message: error.message
      });
    }
  },

  // Get activity logs for a client
  getClientActivityLogs: async (req, res) => {
    try {
      const { id } = req.params;
      const clientLogs = await ActivityLog.find({ resourceType: 'client', resourceId: id });

      res.json({
        success: true,
        data: clientLogs,
        total: clientLogs.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch activity logs',
        message: error.message
      });
    }
  }
};

module.exports = clientController; 