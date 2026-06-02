const express = require('express');
const router = express.Router();
const { getAllUsers, createUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// All routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

// Get all users
router.get('/', getAllUsers);

// Create user (can create user, owner, or admin)
router.post('/', createUser);

module.exports = router;