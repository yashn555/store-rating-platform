import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Rating,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Store as StoreIcon } from '@mui/icons-material';

const UserDetailsDialog = ({ open, onClose, user, stores }) => {
  if (!user) return null;

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'warning';
      case 'owner': return 'success';
      default: return 'primary';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        User Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Basic Information
          </Typography>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">Name</Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">Email</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">Address</Typography>
              <Typography variant="body1">{user.address || 'Not provided'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">Role</Typography>
              <Chip 
                label={user.role.toUpperCase()} 
                color={getRoleColor(user.role)}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Paper>
        </Box>

        {user.role === 'owner' && stores && stores.length > 0 && (
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Store Information & Ratings
            </Typography>
            {stores.map((store) => (
              <Paper key={store.id} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <StoreIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">{store.name}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography variant="body2">{store.email}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">Address</Typography>
                  <Typography variant="body2">{store.address || 'Not provided'}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="textSecondary">Average Rating</Typography>
                    <Box display="flex" alignItems="center">
                      <Rating value={store.averageRating || 0} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {store.averageRating ? `${store.averageRating} / 5` : 'No ratings yet'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Total Ratings</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {store.totalRatings || 0}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {user.role === 'owner' && (!stores || stores.length === 0) && (
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
            <Typography variant="body2" color="textSecondary">
              This store owner hasn't created any stores yet.
            </Typography>
          </Paper>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;