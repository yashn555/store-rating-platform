import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Store as StoreIcon, People as PeopleIcon, Star as StarIcon } from '@mui/icons-material';

const EmptyState = ({ type, message }) => {
  const getIcon = () => {
    switch(type) {
      case 'users': return <PeopleIcon sx={{ fontSize: 64, color: '#bdbdbd' }} />;
      case 'stores': return <StoreIcon sx={{ fontSize: 64, color: '#bdbdbd' }} />;
      case 'ratings': return <StarIcon sx={{ fontSize: 64, color: '#bdbdbd' }} />;
      default: return <StoreIcon sx={{ fontSize: 64, color: '#bdbdbd' }} />;
    }
  };

  return (
    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>{getIcon()}</Box>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {message || `No ${type} found`}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Try adjusting your filters or create a new one
      </Typography>
    </Paper>
  );
};

export default EmptyState;