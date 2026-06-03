import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Collapse,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Store as StoreIcon,
  LocationOn,
  Email,
  People as PeopleIcon,
} from '@mui/icons-material';

const OwnerStoreCard = ({ store }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Store Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
              <StoreIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" component="h2">
                {store.storeName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Store ID: {store.storeId}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={`${store.totalRatings} Rating${store.totalRatings !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Store Details */}
        <Box display="flex" alignItems="center" mb={1}>
          <Email fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {store.storeEmail}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {store.storeAddress || 'No address provided'}
          </Typography>
        </Box>

        {/* Average Rating Section */}
        <Box 
          sx={{ 
            bgcolor: '#f5f5f5', 
            p: 2, 
            borderRadius: 2, 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Average Rating
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {store.averageRating ? store.averageRating.toFixed(1) : 'N/A'}
              <Typography component="span" variant="body1" color="text.secondary">
                /5
              </Typography>
            </Typography>
          </Box>
          <Box>
            <Rating 
              value={store.averageRating || 0} 
              precision={0.5} 
              readOnly 
              size="large"
            />
          </Box>
        </Box>

        {/* Expand Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {store.usersWhoRated.length} user(s) have rated this store
            </Typography>
          </Box>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show users"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        {/* Users Who Rated Table (Collapsible) */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Users Who Rated This Store
            </Typography>
            {store.usersWhoRated.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fafafa' }}>
                <Typography variant="body2" color="text.secondary">
                  No users have rated this store yet.
                </Typography>
              </Paper>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>#</strong></TableCell>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell align="center"><strong>Rating</strong></TableCell>
                      <TableCell><strong>Rated On</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {store.usersWhoRated.map((user, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <Rating value={user.rating} readOnly size="small" />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              ({user.rating})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {new Date(user.ratedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default OwnerStoreCard;