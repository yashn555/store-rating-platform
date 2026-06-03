import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  Alert,
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Store as StoreIcon,
  Star as StarIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { getAllUsers, getAllStores, getUserById, createUser, createStore } from '../services/api';
import UserDetailsDialog from '../components/UserDetailsDialog';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import { TableSkeleton } from '../components/LoadingSkeleton';
import PaginationTable from '../components/PaginationTable';
import ExportButton from '../components/ExportButton';
import EmptyState from '../components/EmptyState';

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [userSort, setUserSort] = useState({ field: 'name', order: 'asc' });
  const [storeSort, setStoreSort] = useState({ field: 'name', order: 'asc' });
  
  // Pagination states
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const [storePage, setStorePage] = useState(0);
  const [storeRowsPerPage, setStoreRowsPerPage] = useState(10);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStores, setUserStores] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  });
  const [userErrors, setUserErrors] = useState({});
  const [addingUser, setAddingUser] = useState(false);
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [storeErrors, setStoreErrors] = useState({});
  const [addingStore, setAddingStore] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/stores');
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersResponse, storesResponse] = await Promise.all([
        getAllUsers(),
        getAllStores()
      ]);
      
      if (usersResponse.success) {
        setUsers(usersResponse.users);
      }
      
      if (storesResponse.success) {
        setStores(storesResponse.stores);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      const response = await getUserById(userId);
      if (response.success) {
        setSelectedUser(response.user);
        setUserStores(response.stores || []);
        setDetailsOpen(true);
      }
    } catch (err) {
      setError('Failed to fetch user details');
    }
  };

  const validateNewUser = () => {
    const errors = {};
    
    if (!newUser.name) {
      errors.name = 'Name is required';
    } else if (newUser.name.length < 20) {
      errors.name = 'Name must be at least 20 characters';
    } else if (newUser.name.length > 60) {
      errors.name = 'Name must not exceed 60 characters';
    }
    
    if (!newUser.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (newUser.address && newUser.address.length > 400) {
      errors.address = 'Address must not exceed 400 characters';
    }
    
    if (!newUser.password) {
      errors.password = 'Password is required';
    } else {
      if (newUser.password.length < 8 || newUser.password.length > 16) {
        errors.password = 'Password must be between 8 and 16 characters';
      } else if (!/[A-Z]/.test(newUser.password)) {
        errors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newUser.password)) {
        errors.password = 'Password must contain at least one special character';
      }
    }
    
    setUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateNewUser()) return;
    
    setAddingUser(true);
    setError('');
    try {
      const response = await createUser(newUser);
      if (response.success) {
        setSuccess(`User "${newUser.name}" created successfully with role: ${newUser.role}`);
        setTimeout(() => setSuccess(''), 3000);
        setAddUserOpen(false);
        setNewUser({ name: '', email: '', address: '', password: '', role: 'user' });
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setAddingUser(false);
    }
  };

  const validateNewStore = () => {
    const errors = {};
    
    if (!newStore.name) {
      errors.name = 'Store name is required';
    } else if (newStore.name.length < 3) {
      errors.name = 'Store name must be at least 3 characters';
    }
    
    if (!newStore.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newStore.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (newStore.address && newStore.address.length > 400) {
      errors.address = 'Address must not exceed 400 characters';
    }
    
    if (!newStore.ownerId) {
      errors.ownerId = 'Owner ID is required';
    } else {
      const ownerExists = users.some(u => u.id === parseInt(newStore.ownerId) && u.role === 'owner');
      if (!ownerExists) {
        errors.ownerId = 'Owner ID must belong to a user with role "owner"';
      }
    }
    
    setStoreErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateStore = async () => {
    if (!validateNewStore()) return;
    
    setAddingStore(true);
    setError('');
    try {
      const response = await createStore(newStore);
      if (response.success) {
        setSuccess(`Store "${newStore.name}" created successfully`);
        setTimeout(() => setSuccess(''), 3000);
        setAddStoreOpen(false);
        setNewStore({ name: '', email: '', address: '', ownerId: '' });
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to create store');
    } finally {
      setAddingStore(false);
    }
  };

  // Filter and sort users
  const filteredUsers = users.filter(u => {
    return (!userFilters.name || u.name.toLowerCase().includes(userFilters.name.toLowerCase())) &&
           (!userFilters.email || u.email.toLowerCase().includes(userFilters.email.toLowerCase())) &&
           (!userFilters.address || (u.address || '').toLowerCase().includes(userFilters.address.toLowerCase())) &&
           (!userFilters.role || u.role === userFilters.role);
  });

  const filteredStores = stores.filter(s => {
    return (!storeFilters.name || s.name.toLowerCase().includes(storeFilters.name.toLowerCase())) &&
           (!storeFilters.email || s.email.toLowerCase().includes(storeFilters.email.toLowerCase())) &&
           (!storeFilters.address || (s.address || '').toLowerCase().includes(storeFilters.address.toLowerCase()));
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[userSort.field] || '';
    let bVal = b[userSort.field] || '';
    if (userSort.field === 'role') {
      const roleOrder = { admin: 1, owner: 2, user: 3 };
      aVal = roleOrder[aVal] || 0;
      bVal = roleOrder[bVal] || 0;
    }
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return userSort.order === 'asc' ? comparison : -comparison;
  });

  const sortedStores = [...filteredStores].sort((a, b) => {
    const aVal = a[storeSort.field] || '';
    const bVal = b[storeSort.field] || '';
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return storeSort.order === 'asc' ? comparison : -comparison;
  });

  // Paginated data
  const paginatedUsers = sortedUsers.slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage);
  const paginatedStores = sortedStores.slice(storePage * storeRowsPerPage, storePage * storeRowsPerPage + storeRowsPerPage);

  const handleUserSort = (field) => {
    setUserSort({
      field,
      order: userSort.field === field && userSort.order === 'asc' ? 'desc' : 'asc'
    });
    setUserPage(0);
  };

  const handleStoreSort = (field) => {
    setStoreSort({
      field,
      order: storeSort.field === field && storeSort.order === 'asc' ? 'desc' : 'asc'
    });
    setStorePage(0);
  };

  const clearUserFilters = () => {
    setUserFilters({ name: '', email: '', address: '', role: '' });
    setUserPage(0);
  };

  const clearStoreFilters = () => {
    setStoreFilters({ name: '', email: '', address: '' });
    setStorePage(0);
  };

  const totalRatings = stores.reduce((sum, store) => sum + (store.totalRatings || 0), 0);
  const previousTotalUsers = users.length - 2; // Mock growth
  const userGrowth = previousTotalUsers > 0 ? ((users.length - previousTotalUsers) / previousTotalUsers * 100).toFixed(0) : 0;

  const getUserAvatarColor = (role) => {
    switch(role) {
      case 'admin': return '#ff9800';
      case 'owner': return '#4caf50';
      default: return '#2196f3';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar sx={{ minHeight: '64px' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, letterSpacing: '0.5px' }}>
            Admin Dashboard
          </Typography>
          <Avatar sx={{ bgcolor: getUserAvatarColor(user?.role), width: 32, height: 32, mr: 2 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ mr: 3, color: '#e0e0e0', display: { xs: 'none', sm: 'block' } }}>
            {user?.name}
          </Typography>
          <Button color="inherit" onClick={() => setPasswordOpen(true)} sx={{ mr: 1, textTransform: 'none' }}>
            Change Password
          </Button>
          <Button color="inherit" onClick={logout} sx={{ textTransform: 'none' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
          <Link href="#" sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', textDecoration: 'none' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Home
          </Link>
          <Typography color="text.primary">Dashboard</Typography>
        </Breadcrumbs>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" variant="body2" sx={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, mb: 1 }}>
                      Total Users
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                      {users.length}
                    </Typography>
                    <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                      <TrendingUpIcon sx={{ fontSize: 14, color: '#2ecc71', mr: 0.5 }} />
                      <Typography variant="caption" color="success.main">
                        +{userGrowth}% from last week
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: '#4361ee20', width: 56, height: 56 }}>
                    <PeopleIcon sx={{ fontSize: 32, color: '#4361ee' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" variant="body2" sx={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, mb: 1 }}>
                      Total Stores
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                      {stores.length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2ecc7120', width: 56, height: 56 }}>
                    <StoreIcon sx={{ fontSize: 32, color: '#2ecc71' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" variant="body2" sx={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, mb: 1 }}>
                      Total Ratings
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                      {totalRatings}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#f39c1220', width: 56, height: 56 }}>
                    <StarIcon sx={{ fontSize: 32, color: '#f39c12' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Users Table */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
              Users
            </Typography>
            <Box display="flex" gap={2}>
              <ExportButton 
                data={sortedUsers} 
                filename="users" 
                headers={['ID', 'Name', 'Email', 'Address', 'Role']}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddUserOpen(true)}
                sx={{ textTransform: 'none', borderRadius: 2, px: 3, bgcolor: '#4361ee', '&:hover': { bgcolor: '#3551b4' } }}
              >
                Add User
              </Button>
            </Box>
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Filter by Name"
                value={userFilters.name}
                onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Filter by Email"
                value={userFilters.email}
                onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Filter by Address"
                value={userFilters.address}
                onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                select
                label="Filter by Role"
                value={userFilters.role}
                onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <IconButton onClick={clearUserFilters} title="Clear Filters" sx={{ bgcolor: '#f5f5f5', borderRadius: 1, '&:hover': { bgcolor: '#e0e0e0' } }}>
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>

          {loading ? (
            <TableSkeleton />
          ) : paginatedUsers.length === 0 ? (
            <EmptyState type="users" message="No users found matching your criteria" />
          ) : (
            <>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: isMobile ? 600 : 'auto' }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa', '& th': { fontWeight: 600, color: '#495057', borderBottom: '2px solid #dee2e6' } }}>
                      <TableCell>ID</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={userSort.field === 'name'}
                          direction={userSort.order}
                          onClick={() => handleUserSort('name')}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={userSort.field === 'email'}
                          direction={userSort.order}
                          onClick={() => handleUserSort('email')}
                        >
                          Email
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={userSort.field === 'role'}
                          direction={userSort.order}
                          onClick={() => handleUserSort('role')}
                        >
                          Role
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} sx={{ '&:hover': { bgcolor: '#f8f9fa', transition: 'background 0.2s' } }}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: getUserAvatarColor(user.role), fontSize: 14 }}>
                              {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            {user.name}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.address || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            sx={{
                              bgcolor: user.role === 'admin' ? '#fff3e0' : user.role === 'owner' ? '#e8f5e9' : '#e3f2fd',
                              color: user.role === 'admin' ? '#e65100' : user.role === 'owner' ? '#2e7d32' : '#1565c0',
                              fontWeight: 500,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleViewUserDetails(user.id)}
                            title="View Details"
                            sx={{ '&:hover': { bgcolor: '#e3f2fd' } }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <PaginationTable
                count={sortedUsers.length}
                page={userPage}
                rowsPerPage={userRowsPerPage}
                onPageChange={(e, newPage) => setUserPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setUserRowsPerPage(parseInt(e.target.value, 10));
                  setUserPage(0);
                }}
              />
            </>
          )}
        </Paper>

        {/* Stores Table */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
              Stores
            </Typography>
            <Box display="flex" gap={2}>
              <ExportButton 
                data={sortedStores} 
                filename="stores" 
                headers={['ID', 'Name', 'Email', 'Address', 'Owner', 'Avg Rating', 'Total Ratings']}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddStoreOpen(true)}
                sx={{ textTransform: 'none', borderRadius: 2, px: 3, bgcolor: '#4361ee', '&:hover': { bgcolor: '#3551b4' } }}
              >
                Add Store
              </Button>
            </Box>
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Filter by Name"
                value={storeFilters.name}
                onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Filter by Email"
                value={storeFilters.email}
                onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Filter by Address"
                value={storeFilters.address}
                onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <IconButton onClick={clearStoreFilters} title="Clear Filters" sx={{ bgcolor: '#f5f5f5', borderRadius: 1, '&:hover': { bgcolor: '#e0e0e0' } }}>
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>

          {loading ? (
            <TableSkeleton />
          ) : paginatedStores.length === 0 ? (
            <EmptyState type="stores" message="No stores found matching your criteria" />
          ) : (
            <>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: isMobile ? 700 : 'auto' }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa', '& th': { fontWeight: 600, color: '#495057', borderBottom: '2px solid #dee2e6' } }}>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Avg Rating</TableCell>
                      <TableCell>Total Ratings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedStores.map((store) => (
                      <TableRow key={store.id} sx={{ '&:hover': { bgcolor: '#f8f9fa', transition: 'background 0.2s' } }}>
                        <TableCell>{store.id}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{store.name}</TableCell>
                        <TableCell>{store.email}</TableCell>
                        <TableCell>{store.address || '-'}</TableCell>
                        <TableCell>
                          {store.owner?.name ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: '#4caf50', fontSize: 12 }}>
                                {store.owner.name?.charAt(0).toUpperCase()}
                              </Avatar>
                              {store.owner.name}
                            </Box>
                          ) : (
                            `Owner ID: ${store.ownerId}`
                          )}
                        </TableCell>
                        <TableCell>
                          {store.averageRating ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <Rating value={store.averageRating} precision={0.5} readOnly size="small" />
                              <Typography variant="body2" sx={{ color: '#f39c12', fontWeight: 500 }}>
                                {store.averageRating}
                              </Typography>
                            </Box>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={store.totalRatings || 0} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <PaginationTable
                count={sortedStores.length}
                page={storePage}
                rowsPerPage={storeRowsPerPage}
                onPageChange={(e, newPage) => setStorePage(newPage)}
                onRowsPerPageChange={(e) => {
                  setStoreRowsPerPage(parseInt(e.target.value, 10));
                  setStorePage(0);
                }}
              />
            </>
          )}
        </Paper>
      </Container>

      <Dialog open={addUserOpen} onClose={() => setAddUserOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          Add New User
          <IconButton
            aria-label="close"
            onClick={() => setAddUserOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Name *"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            margin="normal"
            error={!!userErrors.name}
            helperText={userErrors.name || "Min 20, Max 60 characters"}
          />
          <TextField
            fullWidth
            label="Email *"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            margin="normal"
            error={!!userErrors.email}
            helperText={userErrors.email}
          />
          <TextField
            fullWidth
            label="Address"
            value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            error={!!userErrors.address}
            helperText={userErrors.address || "Max 400 characters (optional)"}
          />
          <TextField
            fullWidth
            label="Password *"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            margin="normal"
            error={!!userErrors.password}
            helperText={userErrors.password || "8-16 chars, 1 uppercase, 1 special character"}
          />
          <TextField
            fullWidth
            select
            label="Role *"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            margin="normal"
          >
            <MenuItem value="user">Normal User</MenuItem>
            <MenuItem value="owner">Store Owner</MenuItem>
            <MenuItem value="admin">System Administrator</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', pt: 2, px: 3, pb: 2 }}>
          <Button onClick={() => setAddUserOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained" disabled={addingUser} sx={{ textTransform: 'none', borderRadius: 1.5 }}>
            {addingUser ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addStoreOpen} onClose={() => setAddStoreOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          Add New Store
          <IconButton
            aria-label="close"
            onClick={() => setAddStoreOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Store Name *"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            margin="normal"
            error={!!storeErrors.name}
            helperText={storeErrors.name || "Min 3 characters"}
          />
          <TextField
            fullWidth
            label="Email *"
            type="email"
            value={newStore.email}
            onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
            margin="normal"
            error={!!storeErrors.email}
            helperText={storeErrors.email}
          />
          <TextField
            fullWidth
            label="Address"
            value={newStore.address}
            onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            error={!!storeErrors.address}
            helperText={storeErrors.address || "Max 400 characters (optional)"}
          />
          <TextField
            fullWidth
            select
            label="Owner *"
            value={newStore.ownerId}
            onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
            margin="normal"
            error={!!storeErrors.ownerId}
            helperText={storeErrors.ownerId || "Select a store owner"}
          >
            <MenuItem value="">Select Owner</MenuItem>
            {users.filter(u => u.role === 'owner').map(owner => (
              <MenuItem key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', pt: 2, px: 3, pb: 2 }}>
          <Button onClick={() => setAddStoreOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleCreateStore} variant="contained" disabled={addingStore} sx={{ textTransform: 'none', borderRadius: 1.5 }}>
            {addingStore ? 'Creating...' : 'Create Store'}
          </Button>
        </DialogActions>
      </Dialog>

      <UserDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        user={selectedUser}
        stores={userStores}
      />

      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </>
  );
};

export default AdminDashboard;