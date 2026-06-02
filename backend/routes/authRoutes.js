const express = require('express');
const router = express.Router();
const { register, login, updatePassword, getUserById } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authenticate } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Register route
router.post('/register', validateRegister, register);

// Login route
router.post('/login', validateLogin, login);

// Update password (authenticated users)
router.put('/change-password', authenticate, updatePassword);

// Get user by ID (Admin only)
router.get('/users/:id', authenticate, adminOnly, getUserById);

module.exports = router;