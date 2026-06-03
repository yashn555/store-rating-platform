import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from '@mui/material';
import { Store as StoreIcon, LocationOn, Email } from '@mui/icons-material';

const StoreCard = ({ store, onSubmitRating, onUpdateRating, userId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [ratingValue, setRatingValue] = useState(store.myRating || 0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasRated = store.myRating !== null && store.myRating !== undefined;
  const existingRatingId = store.myRatingId;

  const handleOpenDialog = () => {
    setRatingValue(store.myRating || 0);
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRatingValue(0);
    setError('');
  };

  const handleSubmit = async () => {
    if (ratingValue < 1 || ratingValue > 5) {
      setError('Please select a rating between 1 and 5');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (hasRated) {
        await onUpdateRating(existingRatingId, ratingValue);
      } else {
        await onSubmitRating(store.id, ratingValue);
      }
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <StoreIcon color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.3 }}>
                {store.name}
              </Typography>
            </Box>
            {hasRated && (
              <Chip 
                label="Rated" 
                size="small" 
                color="success" 
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 24 }}
              />
            )}
          </Box>

          <Box display="flex" alignItems="flex-start" mb={1.5}>
            <LocationOn fontSize="small" color="action" sx={{ mr: 1, mt: 0.3, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {store.address || 'No address provided'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={2.5}>
            <Email fontSize="small" color="action" sx={{ mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {store.email}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.7rem', fontWeight: 500 }}>
                AVERAGE RATING
              </Typography>
              <Box display="flex" alignItems="center">
                <Rating value={store.averageRating || 0} precision={0.5} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 500, color: '#f39c12' }}>
                  {store.averageRating ? store.averageRating.toFixed(1) : '—'}
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.7rem', fontWeight: 500 }}>
                MY RATING
              </Typography>
              {hasRated ? (
                <Box display="flex" alignItems="center">
                  <Rating value={store.myRating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                    {store.myRating}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  Not rated
                </Typography>
              )}
            </Box>
          </Box>

          <Button
            variant="contained"
            color={hasRated ? "warning" : "primary"}
            fullWidth
            onClick={handleOpenDialog}
            sx={{ 
              textTransform: 'none', 
              borderRadius: 1.5, 
              py: 1,
              fontWeight: 500,
              bgcolor: hasRated ? '#f39c12' : '#4361ee',
              '&:hover': { bgcolor: hasRated ? '#e67e22' : '#3551b4' }
            }}
          >
            {hasRated ? 'Update My Rating' : 'Rate This Store'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', fontWeight: 600 }}>
          {hasRated ? 'Update Your Rating' : 'Rate This Store'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
            Store: <strong>{store.name}</strong>
          </Typography>
          <Box display="flex" justifyContent="center" py={2}>
            <Rating
              value={ratingValue}
              onChange={(event, newValue) => {
                setRatingValue(newValue);
                setError('');
              }}
              size="large"
              precision={1}
              sx={{ '& .MuiRating-iconFilled': { color: '#f39c12' } }}
            />
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', pt: 2, px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitting || ratingValue === 0}
            sx={{ textTransform: 'none', borderRadius: 1.5 }}
          >
            {submitting ? 'Submitting...' : hasRated ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreCard;