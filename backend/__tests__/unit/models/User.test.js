const User = require('../../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('Validation', () => {
    it('should create a valid user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'pracownik'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.isActive).toBe(true);
      expect(savedUser.password).not.toBe(userData.password); // powinno być zahashowane
    });

    it('should require email', async () => {
      const userData = {
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new User(userData);
      let err;
      try {
        await user.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(Error);
      expect(err.errors.email).toBeDefined();
    });

    it('should require unique email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      await new User(userData).save();
      
      const duplicateUser = new User(userData);
      let err;
      try {
        await duplicateUser.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(Error);
      expect(err.code).toBe(11000); // MongoDB duplicate key error
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcrypt pattern
    });

    it('should compare password correctly', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new User(userData);
      await user.save();

      const isValid = await user.comparePassword('password123');
      const isInvalid = await user.comparePassword('wrongpassword');

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Role and Permissions', () => {
    it('should have default role as pracownik', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const user = new User(userData);
      await user.save();

      expect(user.role).toBe('pracownik');
    });

    it('should check admin role correctly', async () => {
      const adminUser = new User({
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });

      const regularUser = new User({
        email: 'user@example.com',
        password: 'password123',
        firstName: 'Regular',
        lastName: 'User',
        role: 'pracownik'
      });

      expect(adminUser.isAdmin()).toBe(true);
      expect(regularUser.isAdmin()).toBe(false);
    });

    it('should check permissions correctly', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'pracownik',
        permissions: ['export_bulk', 'view_logs']
      });

      expect(user.hasPermission('export_bulk')).toBe(true);
      expect(user.hasPermission('manage_users')).toBe(false);
      expect(user.hasPermission('export_zip')).toBe(false);
    });

    it('should allow admin to have all permissions', async () => {
      const adminUser = new User({
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });

      expect(adminUser.hasPermission('export_bulk')).toBe(true);
      expect(adminUser.hasPermission('manage_users')).toBe(true);
      expect(adminUser.hasPermission('any_permission')).toBe(true);
    });
  });
}); 