const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Define associations

// User to Store (One-to-Many)
User.hasMany(Store, {
  foreignKey: 'ownerId',
  as: 'stores',
  onDelete: 'CASCADE',
});

Store.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

// User to Rating (One-to-Many)
User.hasMany(Rating, {
  foreignKey: 'userId',
  as: 'ratings',
  onDelete: 'CASCADE',
});

Rating.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Store to Rating (One-to-Many)
Store.hasMany(Rating, {
  foreignKey: 'storeId',
  as: 'ratings',
  onDelete: 'CASCADE',
});

Rating.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'store',
});

// Export all models and associations
module.exports = {
  User,
  Store,
  Rating,
};