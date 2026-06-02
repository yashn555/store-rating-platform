const { Store, Rating, User } = require('../models');
const { sequelize } = require('../config/db');

// Get owner dashboard data
const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id; // From authenticated user (must be owner)

    // Find all stores owned by this owner
    const stores = await Store.findAll({
      where: { ownerId: ownerId },
      attributes: ['id', 'name', 'email', 'address', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating', 'userId', 'createdAt'],
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (stores.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No stores found for this owner',
        data: {
          stores: []
        }
      });
    }

    // Process dashboard data for each store
    const dashboardData = stores.map(store => {
      const storeJSON = store.toJSON();
      const ratings = storeJSON.ratings || [];
      
      // Calculate average rating
      let averageRating = null;
      if (ratings.length > 0) {
        const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
        averageRating = parseFloat((sum / ratings.length).toFixed(2));
      }
      
      // Extract user list who rated (with their ratings)
      const usersWhoRated = ratings.map(rating => ({
        name: rating.user.name,
        email: rating.user.email,
        rating: rating.rating,
        ratedAt: rating.createdAt
      }));

      return {
        storeId: storeJSON.id,
        storeName: storeJSON.name,
        storeEmail: storeJSON.email,
        storeAddress: storeJSON.address,
        averageRating: averageRating,
        totalRatings: ratings.length,
        usersWhoRated: usersWhoRated
      };
    });

    res.status(200).json({
      success: true,
      data: {
        ownerId: ownerId,
        ownerName: req.user.name,
        ownerEmail: req.user.email,
        stores: dashboardData
      }
    });

  } catch (error) {
    console.error('Get owner dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data',
      error: error.message
    });
  }
};

module.exports = {
  getOwnerDashboard
};