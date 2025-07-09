const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');
const Client = require('../../models/Client');
const Signature = require('../../models/Signature');
const fs = require('fs');
const path = require('path');

describe('Export Performance Tests', () => {
  let adminUser, testClients;

  beforeAll(async () => {
    // Utwórz admina
    adminUser = new User({
      email: 'admin@performance.test',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'Performance',
      role: 'admin',
      permissions: ['export_bulk', 'export_zip']
    });
    await adminUser.save();

    // Utwórz testowych klientów (100 klientów)
    testClients = [];
    for (let i = 0; i < 100; i++) {
      const client = new Client({
        firstName: `Test${i}`,
        lastName: `Client${i}`,
        email: `test${i}@client.com`,
        phone: `+4812345678${i.toString().padStart(2, '0')}`
      });
      testClients.push(await client.save());
    }

    // Utwórz testowe podpisy dla każdego klienta
    for (const client of testClients) {
      const signature = new Signature({
        clientId: client._id,
        type: 'consent',
        filePath: 'test-signature.png',
        originalName: 'signature.png',
        valid: true,
        signedAt: new Date()
      });
      await signature.save();
    }
  });

  describe('Export ZIP Performance', () => {
    it('should export 10 clients within 5 seconds', async () => {
      const startTime = Date.now();
      const clientIds = testClients.slice(0, 10).map(c => c._id.toString());

      const response = await request(app)
        .post('/api/export/clients/zip')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .send({ clientIds });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(5000); // mniej niż 5 sekund
      expect(response.headers['content-type']).toContain('application/zip');
    }, 10000); // timeout 10 sekund

    it('should export 50 clients within 15 seconds', async () => {
      const startTime = Date.now();
      const clientIds = testClients.slice(0, 50).map(c => c._id.toString());

      const response = await request(app)
        .post('/api/export/clients/zip')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .send({ clientIds });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(15000); // mniej niż 15 sekund
      expect(response.headers['content-type']).toContain('application/zip');
    }, 20000); // timeout 20 sekund

    it('should handle large export with streaming', async () => {
      const startTime = Date.now();
      const clientIds = testClients.map(c => c._id.toString());

      const response = await request(app)
        .post('/api/export/clients/zip')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .send({ clientIds })
        .expect('Transfer-Encoding', 'chunked'); // sprawdź czy używa streaming

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(30000); // mniej niż 30 sekund
      expect(response.headers['content-type']).toContain('application/zip');
    }, 35000); // timeout 35 sekund
  });

  describe('Export Queue Performance', () => {
    it('should queue export job quickly', async () => {
      const startTime = Date.now();
      const clientIds = testClients.slice(0, 20).map(c => c._id.toString());

      const response = await request(app)
        .post('/api/export/clients/zip/queue')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .send({ clientIds });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000); // mniej niż 1 sekunda
      expect(response.body.data.jobId).toBeDefined();
    });

    it('should handle multiple concurrent export requests', async () => {
      const clientIds = testClients.slice(0, 10).map(c => c._id.toString());
      const requests = [];

      // Wysyłaj 5 równoczesnych requestów
      for (let i = 0; i < 5; i++) {
        requests.push(
          request(app)
            .post('/api/export/clients/zip/queue')
            .set('Authorization', `Bearer ${adminUser.generateToken()}`)
            .send({ clientIds })
        );
      }

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(3000); // mniej niż 3 sekundy
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.data.jobId).toBeDefined();
      });
    });
  });

  describe('File Download Performance', () => {
    it('should download signature file quickly', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/signatures/file/test-signature.png')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000); // mniej niż 1 sekunda
    });

    it('should handle large file downloads with streaming', async () => {
      // Utwórz duży plik testowy (1MB)
      const testFilePath = path.join(__dirname, '../../uploads/signatures/large-test.png');
      const testData = Buffer.alloc(1024 * 1024, 'A'); // 1MB danych
      fs.writeFileSync(testFilePath, testData);

      const startTime = Date.now();

      const response = await request(app)
        .get('/api/signatures/file/large-test.png')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .expect('Transfer-Encoding', 'chunked');

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000); // mniej niż 2 sekundy

      // Usuń testowy plik
      fs.unlinkSync(testFilePath);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not exceed memory limits during large export', async () => {
      const initialMemory = process.memoryUsage();
      const clientIds = testClients.map(c => c._id.toString());

      const response = await request(app)
        .post('/api/export/clients/zip')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`)
        .send({ clientIds });

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      expect(response.status).toBe(200);
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // mniej niż 100MB wzrostu
    }, 60000); // timeout 60 sekund
  });

  describe('Database Query Performance', () => {
    it('should fetch clients with pagination efficiently', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/clients?page=1&limit=50')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000); // mniej niż 1 sekunda
      expect(response.body.data.length).toBeLessThanOrEqual(50);
    });

    it('should handle complex queries efficiently', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/clients?search=Test&archived=false&sort=-createdAt')
        .set('Authorization', `Bearer ${adminUser.generateToken()}`);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000); // mniej niż 1 sekunda
    });
  });
}); 