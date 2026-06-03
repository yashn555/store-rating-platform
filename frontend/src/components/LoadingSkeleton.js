import React from 'react';
import { Skeleton, Card, CardContent, Box, Grid } from '@mui/material';

export const TableSkeleton = () => (
  <Box sx={{ width: '100%' }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} variant="rectangular" height={50} sx={{ mb: 1, borderRadius: 1 }} />
    ))}
  </Box>
);

export const CardSkeleton = () => (
  <Card sx={{ borderRadius: 2 }}>
    <CardContent>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="text" sx={{ mt: 1 }} />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);

export const StoreCardSkeleton = () => (
  <Card sx={{ borderRadius: 2 }}>
    <CardContent>
      <Skeleton variant="rectangular" height={100} sx={{ mb: 1 }} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
    </CardContent>
  </Card>
);