const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user when admin is authenticated', async () => {
      // Utwórz admina
      const admin = new User({
        email: 'admin@test.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
      await admin.save();

      const newUserData = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'pracownik'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${admin.generateToken()}`)
        .send(newUserData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(newUserData.email);
      expect(response.body.data.firstName).toBe(newUserData.firstName);
      expect(response.body.data.lastName).toBe(newUserData.lastName);
      expect(response.body.data.role).toBe(newUserData.role);
    });

    it('should reject registration without admin token', async () => {
      const newUserData = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUserData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration with non-admin token', async () => {
      // Utwórz zwykłego użytkownika
      const user = new User({
        email: 'user@test.com',
        password: 'password123',
        firstName: 'Regular',
        lastName: 'User',
        role: 'pracownik'
      });
      await user.save();

      const newUserData = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${user.generateToken()}`)
        .send(newUserData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Utwórz użytkownika do testów
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'pracownik'
      });
      await user.save();
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.user.firstName).toBe('Test');
      expect(response.body.data.user.lastName).toBe('User');
      expect(response.body.data.user.role).toBe('pracownik');
    });

    it('should reject login with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should reject login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile when authenticated', async () => {
      const user = new User({
        email: 'profile@test.com',
        password: 'password123',
        firstName: 'Profile',
        lastName: 'User',
        role: 'pracownik'
      });
      await user.save();

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${user.generateToken()}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.firstName).toBe(user.firstName);
      expect(response.body.data.lastName).toBe(user.lastName);
      expect(response.body.data.password).toBeUndefined(); // hasło nie powinno być zwrócone
    });

    it('should reject profile access without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully when authenticated', async () => {
      const user = new User({
        email: 'logout@test.com',
        password: 'password123',
        firstName: 'Logout',
        lastName: 'User',
        role: 'pracownik'
      });
      await user.save();

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${user.generateToken()}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });

    it('should reject logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
}); 