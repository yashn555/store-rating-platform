const { Store, User, Rating } = require('../models');
const { sequelize } = require('../config/db');

// Get all stores with average rating and ratings count
const getAllStores = async (req, res) => {
  try {
    // Fetch all stores with owner information and ratings
    const stores = await Store.findAll({
      attributes: ['id', 'name', 'email', 'address', 'ownerId', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating and total ratings for each store
    const storesWithAvgRating = stores.map(store => {
      const storeJSON = store.toJSON();
      const ratings = storeJSON.ratings || [];
      
      let averageRating = null;
      let totalRatings = ratings.length;
      
      if (ratings.length > 0) {
        const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
        averageRating = parseFloat((sum / ratings.length).toFixed(2));
      }
      
      // Remove ratings array from response (optional - can keep if needed)
      delete storeJSON.ratings;
      
      return {
        ...storeJSON,
        averageRating,
        totalRatings // Add total ratings count
      };
    });

    res.status(200).json({
      success: true,
      count: storesWithAvgRating.length,
      stores: storesWithAvgRating
    });

  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stores',
      error: error.message
    });
  }
};

// Create new store (Admin only)
const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Validate required fields
    if (!name || !email || !ownerId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, and ownerId are required'
      });
    }

    // Validate name length (minimum 3 characters for store name)
    if (name.length < 3 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Store name must be between 3 and 100 characters'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate address (if provided, max 400 characters)
    if (address && address.length > 400) {
      return res.status(400).json({
        success: false,
        message: 'Address cannot exceed 400 characters'
      });
    }

    // Check if owner exists
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found. Please provide a valid ownerId'
      });
    }

    // Check if store with same email already exists
    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'Store already exists with this email'
      });
    }

    // Create new store
    const newStore = await Store.create({
      name,
      email,
      address: address || null,
      ownerId
    });

    // Fetch the created store with owner details
    const storeWithOwner = await Store.findByPk(newStore.id, {
      attributes: ['id', 'name', 'email', 'address', 'ownerId', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      store: storeWithOwner,
      averageRating: null, // New store has no ratings yet
      totalRatings: 0 // New store has 0 ratings
    });

  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating store',
      error: error.message
    });
  }
};

module.exports = {
  getAllStores,
  createStore
};