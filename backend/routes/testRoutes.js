const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { adminOnly, ownerOnly, userOnly, allowRoles } = require('../middleware/roleMiddleware');

// Admin only test route
router.get('/admin-test', authenticate, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome Admin! You have access to this route.',
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Owner only test route
router.get('/owner-test', authenticate, ownerOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome Owner! You have access to this route.',
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// User only test route
router.get('/user-test', authenticate, userOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome User! You have access to this route.',
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Multiple roles allowed test route
router.get('/admin-owner-test', authenticate, allowRoles(['admin', 'owner']), (req, res) => {
  res.json({
    success: true,
    message: `Welcome ${req.user.role}! You have access to this route.`,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;