import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Chip, CircularProgress } from '@mui/material';
import { getAuth } from 'firebase/auth';
import OrderService from '../../../services/OrderService';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setError('Please login to view your orders');
          return;
        }

        const orderService = new OrderService(user.uid);
        const result = await orderService.getUserOrders();
        if (result.success) {
          setOrders(result.orders);
        } else {
          setError(result.error || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const statusColors = {
      'placed': 'info',
      'confirmed': 'primary',
      'shipped': 'secondary',
      'out_for_delivery': 'warning',
      'delivered': 'success'
    };
    return statusColors[status] || 'default';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleOrderClick = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 3, color: 'error.main', textAlign: 'center', marginTop: '70px' }}>
      <Header />
      <Typography variant="h6">{error}</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3, marginTop: '70px' }}>
      <Header />
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Order History
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No orders found</Typography>
          <Typography variant="body1" color="text.secondary">
            You haven't placed any orders yet
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Paper
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 6 },
                  transition: 'box-shadow 0.3s'
                }}
                onClick={() => handleOrderClick(order.id)}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={2}>
                    <img
                      src={order.products?.[0]?.imageUrl}
                      alt={order.products?.[0]?.title || 'Product'}
                      style={{ width: '100%', maxWidth: '100px', height: 'auto' }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1">{order.products?.[0]?.title || 'Product'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Order ID: {order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ordered on: {formatDate(order.createdAt)}
                    </Typography>
                    {order.products && order.products.length > 1 && (
                      <Typography variant="body2" color="text.secondary">
                        +{order.products.length - 1} more items
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1">
                      Total Items: {order.products?.reduce((sum, product) => sum + (product.quantity || 1), 0) || 0}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹{order.totalAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ textAlign: { sm: 'right' } }}>
                    <Chip
                      label={order.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(order.status)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Footer />
    </Box>
  );
}

export default OrderHistory;