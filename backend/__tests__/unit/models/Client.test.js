const Client = require('../../../models/Client');

describe('Client Model', () => {
  describe('Validation', () => {
    it('should create a valid client', async () => {
      const clientData = {
        firstName: 'Anna',
        lastName: 'Kowalska',
        email: 'anna@example.com',
        phone: '+48123456789'
      };

      const client = new Client(clientData);
      const savedClient = await client.save();

      expect(savedClient.firstName).toBe(clientData.firstName);
      expect(savedClient.lastName).toBe(clientData.lastName);
      expect(savedClient.email).toBe(clientData.email);
      expect(savedClient.phone).toBe(clientData.phone);
      expect(savedClient.archived).toBe(false);
      expect(savedClient.createdAt).toBeDefined();
      expect(savedClient.updatedAt).toBeDefined();
    });

    it('should require firstName', async () => {
      const clientData = {
        lastName: 'Kowalska',
        email: 'anna@example.com'
      };

      const client = new Client(clientData);
      let err;
      try {
        await client.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(Error);
      expect(err.errors.firstName).toBeDefined();
    });

    it('should require lastName', async () => {
      const clientData = {
        firstName: 'Anna',
        email: 'anna@example.com'
      };

      const client = new Client(clientData);
      let err;
      try {
        await client.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(Error);
      expect(err.errors.lastName).toBeDefined();
    });

    it('should allow optional email and phone', async () => {
      const clientData = {
        firstName: 'Anna',
        lastName: 'Kowalska'
      };

      const client = new Client(clientData);
      const savedClient = await client.save();

      expect(savedClient.email).toBeUndefined();
      expect(savedClient.phone).toBeUndefined();
    });
  });

  describe('Default Values', () => {
    it('should set archived to false by default', async () => {
      const clientData = {
        firstName: 'Anna',
        lastName: 'Kowalska'
      };

      const client = new Client(clientData);
      const savedClient = await client.save();

      expect(savedClient.archived).toBe(false);
    });

    it('should set timestamps automatically', async () => {
      const clientData = {
        firstName: 'Anna',
        lastName: 'Kowalska'
      };

      const client = new Client(clientData);
      const savedClient = await client.save();

      expect(savedClient.createdAt).toBeInstanceOf(Date);
      expect(savedClient.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Data Types', () => {
    it('should handle string fields correctly', async () => {
      const clientData = {
        firstName: 'Anna',
        lastName: 'Kowalska',
        email: 'anna@example.com',
        phone: '+48123456789'
      };

      const client = new Client(clientData);
      const savedClient = await client.save();

      expect(typeof savedClient.firstName).toBe('string');
      expect(typeof savedClient.lastName).toBe('string');
      expect(typeof savedClient.email).toBe('string');
      expect(typeof savedClient.phone).toBe('string');
    });

    it('should handle boolean archived field', async () => {
      const clientData = {
        firstName: 'Anna',
        lastName: 'Kowalska',
        archived: true
      };

      const client = new Client(clientData);
      const savedClient = await client.save();

      expect(typeof savedClient.archived).toBe('boolean');
      expect(savedClient.archived).toBe(true);
    });
  });
}); 