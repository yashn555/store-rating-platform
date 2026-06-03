import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/auth/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get all stores
export const getAllStores = async () => {
  try {
    const response = await api.get('/stores');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User: Get all stores with ratings
export const getUserStores = async () => {
  try {
    const response = await api.get('/stores');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User: Submit rating
export const submitRating = async (storeId, rating) => {
  try {
    const response = await api.post('/ratings', { storeId, rating });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User: Update rating
export const updateRating = async (ratingId, rating) => {
  try {
    const response = await api.put(`/ratings/${ratingId}`, { rating });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Owner: Get dashboard data
export const getOwnerDashboard = async () => {
  try {
    const response = await api.get('/owner/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Create new user
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Create new store
export const createStore = async (storeData) => {
  try {
    const response = await api.post('/stores', storeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;