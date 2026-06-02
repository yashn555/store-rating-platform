const { Rating, Store, User } = require('../models');

// Submit a new rating
const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id; // From authenticated user

    // Validate required fields
    if (!storeId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: storeId and rating are required'
      });
    }

    // Validate rating range (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Validate rating is integer
    if (!Number.isInteger(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a whole number'
      });
    }

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: {
        userId: userId,
        storeId: storeId
      }
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this store. Use UPDATE to change your rating.'
      });
    }

    // Create new rating
    const newRating = await Rating.create({
      userId: userId,
      storeId: storeId,
      rating: rating
    });

    // Fetch the created rating with store and user details
    const ratingWithDetails = await Rating.findByPk(newRating.id, {
      attributes: ['id', 'rating', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      rating: ratingWithDetails
    });

  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting rating',
      error: error.message
    });
  }
};

// Update existing rating
const updateRating = async (req, res) => {
  try {
    const ratingId = req.params.id;
    const { rating } = req.body;
    const userId = req.user.id; // From authenticated user

    // Validate rating
    if (!rating) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required'
      });
    }

    // Validate rating range (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Validate rating is integer
    if (!Number.isInteger(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a whole number'
      });
    }

    // Find the rating
    const existingRating = await Rating.findByPk(ratingId);
    
    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check if the rating belongs to the authenticated user
    if (existingRating.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own ratings'
      });
    }

    // Update the rating
    await existingRating.update({
      rating: rating
    });

    // Fetch the updated rating with details
    const updatedRating = await Rating.findByPk(ratingId, {
      attributes: ['id', 'rating', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Rating updated successfully',
      rating: updatedRating
    });

  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating rating',
      error: error.message
    });
  }
};

module.exports = {
  submitRating,
  updateRating
};