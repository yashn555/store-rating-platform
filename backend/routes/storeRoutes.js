const express = require('express');
const router = express.Router();
const { getAllStores, createStore } = require('../controllers/storeController');
const { authenticate } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Get all stores - Requires authentication (any role can view stores)
router.get('/', authenticate, getAllStores);

// Create store - Admin only
router.post('/', authenticate, adminOnly, createStore);

module.exports = router;