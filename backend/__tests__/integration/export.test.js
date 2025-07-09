const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');
const Client = require('../../models/Client');

describe('Export Endpoints', () => {
  let adminUser, regularUser, testClient;

  beforeEach(async () => {
    // Utwórz admina
    adminUser = new User({
      email: 'admin@test.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      permissions: ['export_bulk', 'export_zip']
    });
    await adminUser.save();

    // Utwórz zwykłego użytkownika
    regularUser = new User({
      email: 'user@test.com',
      password: 'password123',
      firstName: 'Regular',
      lastName: 'User',
      role: 'pracownik',
      permissions: ['export_bulk']
    });
    await regularUser.save();

    // Utwórz testowego klienta
    testClient = new Client({
      firstName: 'Test',
      lastName: 'Client',
      email: 'test@client.com',
      phone: '+48123456789'
    });
    await testClient.save();
  });

  describe('POST /api/export/clients/zip', () => {
    it('should export clients to ZIP when admin is authenticated', async () => {
      const exportData = {
        clientIds: [testClient._id.toString()]
      };

      const response = await request(app)
        .post('/api/export/clients/zip')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .send(exportData);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/zip');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    it('should reject export without authentication', async () => {
      const exportData = {
        clientIds: [testClient._id.toString()]
      };

      const response = await request(app)
        .post('/api/export/clients/zip')
        .send(exportData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject export without export permission', async () => {
      // Utwórz użytkownika bez uprawnień eksportu
      const userWithoutPermission = new User({
        email: 'nopermission@test.com',
        password: 'password123',
        firstName: 'No',
        lastName: 'Permission',
        role: 'pracownik',
        permissions: []
      });
      await userWithoutPermission.save();

      const exportData = {
        clientIds: [testClient._id.toString()]
      };

      const response = await request(app)
        .post('/api/export/clients/zip')
        .set('Authorization', `Bearer ${userWithoutPermission.generateToken()}`)
        .send(exportData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should reject export with empty clientIds', async () => {
      const exportData = {
        clientIds: []
      };

      const response = await request(app)
        .post('/api/export/clients/zip')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .send(exportData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/export/clients/zip/queue', () => {
    it('should queue export job when admin is authenticated', async () => {
      const exportData = {
        clientIds: [testClient._id.toString()]
      };

      const response = await request(app)
        .post('/api/export/clients/zip/queue')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .send(exportData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.jobId).toBeDefined();
      expect(response.body.data.requestId).toBeDefined();
      expect(response.body.data.status).toBe('queued');
    });

    it('should reject queue export without authentication', async () => {
      const exportData = {
        clientIds: [testClient._id.toString()]
      };

      const response = await request(app)
        .post('/api/export/clients/zip/queue')
        .send(exportData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/export/status/:jobId', () => {
    it('should return job status when authenticated', async () => {
      // Najpierw dodaj job do kolejki
      const exportData = {
        clientIds: [testClient._id.toString()]
      };

      const queueResponse = await request(app)
        .post('/api/export/clients/zip/queue')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .send(exportData);

      const jobId = queueResponse.body.data.jobId;

      const response = await request(app)
        .get(`/api/export/status/${jobId}`)
        .set('Authorization', `Bearer ${adminUser.generateToken()}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.jobId).toBe(jobId);
      expect(response.body.data.status).toBeDefined();
    });

    it('should reject status check without authentication', async () => {
      const response = await request(app)
        .get('/api/export/status/123');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/export/client/:clientId/pdf', () => {
    it('should export single client to PDF when authenticated', async () => {
      const response = await request(app)
        .get(`/api/export/client/${testClient._id}/pdf`)
        .set('Authorization', `Bearer ${regularUser.generateToken()}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/pdf');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    it('should reject single export without authentication', async () => {
      const response = await request(app)
        .get(`/api/export/client/${testClient._id}/pdf`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject single export for non-existent client', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/export/client/${fakeId}/pdf`)
        .set('Authorization', `Bearer ${regularUser.generateToken()}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
}); 