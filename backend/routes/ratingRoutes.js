const express = require('express');
const router = express.Router();
const { submitRating, updateRating } = require('../controllers/ratingController');
const { authenticate } = require('../middleware/authMiddleware');

// All rating routes require authentication
router.use(authenticate);

// Submit a new rating
router.post('/', submitRating);

// Update an existing rating
router.put('/:id', updateRating);

module.exports = router;