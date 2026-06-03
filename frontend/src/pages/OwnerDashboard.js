import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Store as StoreIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Star as StarIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOwnerDashboard } from '../services/api';
import OwnerStoreCard from '../components/OwnerStoreCard';
import ChangePasswordDialog from '../components/ChangePasswordDialog';

const OwnerDashboard = () => {
  const { user, logout, isAuthenticated, isOwner } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isOwner) {
      if (user?.role === 'admin') navigate('/admin');
      else navigate('/stores');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, isOwner, user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getOwnerDashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError(err.message || 'Error loading dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalStores = dashboardData?.stores?.length || 0;
  const totalRatings = dashboardData?.stores?.reduce((sum, store) => sum + (store.totalRatings || 0), 0);
  const avgRatingAcrossStores = dashboardData?.stores?.length > 0
    ? (dashboardData.stores.reduce((sum, store) => sum + (store.averageRating || 0), 0) / 
       dashboardData.stores.filter(store => store.averageRating !== null).length)
    : null;

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
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Store Owner Dashboard
          </Typography>
          <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32, mr: 2 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ mr: 3, color: '#e0e0e0', display: { xs: 'none', sm: 'block' } }}>
            {user?.name}
          </Typography>
          <Button color="inherit" onClick={() => setPasswordOpen(true)} sx={{ mr: 1, textTransform: 'none' }}>
            Change Password
          </Button>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ textTransform: 'none' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Owner Information
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>{dashboardData?.ownerName}</Typography>
                <Typography variant="body2" color="textSecondary">{dashboardData?.ownerEmail}</Typography>
                <Chip label="Store Owner" size="small" sx={{ mt: 2, bgcolor: '#e8f5e9', color: '#2e7d32' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Performance Overview
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" fontWeight={600}>{totalStores}</Typography>
                    <Typography variant="caption" color="textSecondary">Total Stores</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={600}>{totalRatings}</Typography>
                    <Typography variant="caption" color="textSecondary">Total Ratings</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={600}>
                      {avgRatingAcrossStores ? avgRatingAcrossStores.toFixed(1) : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">Avg Rating</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <StoreIcon sx={{ color: '#2e7d32' }} />
          <Typography variant="h5" fontWeight={600}>My Stores ({totalStores})</Typography>
        </Box>

        {dashboardData?.stores?.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <StoreIcon sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">No Stores Found</Typography>
            <Typography variant="body2" color="textSecondary">
              You haven't created any stores yet. Contact an admin to create stores for you.
            </Typography>
          </Paper>
        ) : (
          dashboardData?.stores.map((store) => (
            <OwnerStoreCard key={store.storeId} store={store} />
          ))
        )}
      </Container>

      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </>
  );
};

export default OwnerDashboard;