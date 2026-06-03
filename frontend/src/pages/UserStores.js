import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Logout as LogoutIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserStores, submitRating, updateRating } from '../services/api';
import StoreCard from '../components/StoreCard';
import ChangePasswordDialog from '../components/ChangePasswordDialog';

const UserStores = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchStores();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.address && store.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStores(filtered);
    }
  }, [searchTerm, stores]);

  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getUserStores();
      if (response.success) {
        const storesWithUserRatings = response.stores.map(store => {
          const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
          const userRating = userRatings[store.id];
          return {
            ...store,
            myRating: userRating ? userRating.rating : null,
            myRatingId: userRating ? userRating.id : null,
            totalRatings: store.totalRatings || 0,
          };
        });
        setStores(storesWithUserRatings);
        setFilteredStores(storesWithUserRatings);
      } else {
        setError('Failed to load stores');
      }
    } catch (err) {
      setError('Error loading stores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (storeId, rating) => {
    try {
      const response = await submitRating(storeId, rating);
      if (response.success) {
        const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
        userRatings[storeId] = { rating: rating, id: response.rating.id };
        localStorage.setItem('userRatings', JSON.stringify(userRatings));
        setSuccessMessage('Rating submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchStores();
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to submit rating');
    }
  };

  const handleUpdateRating = async (ratingId, rating) => {
    try {
      const response = await updateRating(ratingId, rating);
      if (response.success) {
        const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
        const storeEntry = Object.entries(userRatings).find(([_, value]) => value.id === ratingId);
        if (storeEntry) {
          const [storeId] = storeEntry;
          userRatings[storeId] = { rating: rating, id: ratingId };
          localStorage.setItem('userRatings', JSON.stringify(userRatings));
        }
        setSuccessMessage('Rating updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchStores();
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to update rating');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1a1a2e' }}>
        <Toolbar sx={{ minHeight: '64px' }}>
          <StoreIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Store Finder
          </Typography>
          <Avatar sx={{ bgcolor: '#2196f3', width: 32, height: 32, mr: 2 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ mr: 3, color: '#e0e0e0', display: { xs: 'none', sm: 'block' } }}>
            {user?.name}
          </Typography>
          <Button color="inherit" onClick={() => setPasswordOpen(true)} sx={{ mr: 1, textTransform: 'none' }}>
            Change Password
          </Button>
          {user?.role === 'admin' && (
            <Button color="inherit" onClick={() => navigate('/admin')} sx={{ mr: 1, textTransform: 'none' }}>
              Admin Panel
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ textTransform: 'none' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Browse Stores
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by store name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Chip 
            label={`${filteredStores.length} store${filteredStores.length !== 1 ? 's' : ''} found`}
            size="small"
            sx={{ mt: 2 }}
          />
        </Paper>

        {filteredStores.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <StoreIcon sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No stores found matching your search
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your search term
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredStores.map((store) => (
              <Grid item xs={12} sm={6} md={4} key={store.id}>
                <StoreCard
                  store={store}
                  onSubmitRating={handleSubmitRating}
                  onUpdateRating={handleUpdateRating}
                  userId={user?.id}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </>
  );
};

export default UserStores;