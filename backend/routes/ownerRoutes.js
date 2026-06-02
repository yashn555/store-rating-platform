const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { authenticate } = require('../middleware/authMiddleware');
const { ownerOnly } = require('../middleware/roleMiddleware');

// Owner dashboard - requires authentication and owner role
router.get('/dashboard', authenticate, ownerOnly, getOwnerDashboard);

module.exports = router;