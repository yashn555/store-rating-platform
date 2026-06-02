const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log, // temporary
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully');

    // LOAD MODELS & ASSOCIATIONS
    require('../models');

    console.log('Models Loaded:', Object.keys(sequelize.models));

    await sequelize.sync();

    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Unable to connect to MySQL:', error);
  }
};

module.exports = { sequelize, connectDB };