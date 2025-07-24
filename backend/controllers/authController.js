const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

const authController = {
  // Rejestracja użytkownika (tylko admin może rejestrować)
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName, role, permissions } = req.body;
      
      // Sprawdź czy użytkownik już istnieje
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }
      
      // Utwórz nowego użytkownika
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        role: role || 'pracownik',
        permissions: permissions || []
      });
      
      await user.save();
      
      // Log rejestracji
      const log = new ActivityLog({
        operation: 'register',
        resourceType: 'user',
        resourceId: user._id.toString(),
        userId: req.user?.id || 'system',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: { action: 'register', email, role }
      });
      await log.save();
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to register user',
        message: error.message
      });
    }
  },

  // Logowanie użytkownika
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Znajdź użytkownika
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      
      // Sprawdź czy użytkownik jest aktywny
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Account is deactivated'
        });
      }
      
      // Sprawdź hasło
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      
      // Aktualizuj ostatnie logowanie
      user.lastLogin = new Date();
      await user.save();
      
      // Wygeneruj token
      const token = generateToken(user._id);
      
      // Log logowania
      const log = new ActivityLog({
        operation: 'login',
        resourceType: 'auth',
        resourceId: user._id.toString(),
        userId: user._id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      await log.save();
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            permissions: user.permissions
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Login failed',
        message: error.message
      });
    }
  },

  // Pobierz profil użytkownika
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get profile',
        message: error.message
      });
    }
  },

  // Wylogowanie (tylko po stronie klienta - token zostaje unieważniony)
  logout: async (req, res) => {
    try {
      // Log wylogowania
      const log = new ActivityLog({
        operation: 'logout',
        resourceType: 'auth',
        resourceId: req.user._id.toString(),
        userId: req.user._id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      await log.save();
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Logout failed',
        message: error.message
      });
    }
  }
};

module.exports = authController; 