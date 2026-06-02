const bcrypt = require('bcrypt');
const { User } = require('../models');
const { validateUserRole } = require('../middleware/validation');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, exclude password field
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
};

// Create user (Admin can create any role)
const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    // Validate role
    const allowedRoles = ['user', 'owner', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Allowed roles: user, owner, admin'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Validate name length (20-60 characters)
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 20 and 60 characters'
      });
    }

    // Validate address length (max 400)
    if (address && address.length > 400) {
      return res.status(400).json({
        success: false,
        message: 'Address cannot exceed 400 characters'
      });
    }

    // Validate password (8-16 chars, uppercase, special char)
    if (password.length < 8 || password.length > 16) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 8 and 16 characters'
      });
    }
    
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter'
      });
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one special character'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with specified role
    const newUser = await User.create({
      name,
      email,
      address: address || null,
      password: hashedPassword,
      role: role // Admin can set any role
    });

    // Return user data (excluding password)
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      address: newUser.address,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    res.status(201).json({
      success: true,
      message: `User created successfully with role: ${role}`,
      user: userData
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating user',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  createUser
};