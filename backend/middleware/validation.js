const validator = require('validator');

// Validation rules for registration
const validateRegister = (req, res, next) => {
  const { name, email, address, password } = req.body;
  const errors = [];

  // Name validation: 20-60 characters
  if (!name || name.length < 20 || name.length > 60) {
    errors.push('Name must be between 20 and 60 characters');
  }

  // Email validation
  if (!email || !validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Address validation: maximum 400 characters
  if (address && address.length > 400) {
    errors.push('Address cannot exceed 400 characters');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else {
    // Check length: 8-16 characters
    if (password.length < 8 || password.length > 16) {
      errors.push('Password must be between 8 and 16 characters');
    }
    
    // Check at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    // Check at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors: errors 
    });
  }

  next();
};

// Validation rules for login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors: errors 
    });
  }

  next();
};

// Validate user role (for admin creation)
const validateUserRole = (role) => {
  const allowedRoles = ['user', 'owner', 'admin'];
  return allowedRoles.includes(role);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUserRole
};