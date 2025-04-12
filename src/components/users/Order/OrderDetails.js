import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Stepper, Step, StepLabel, Grid, Divider } from '@mui/material';
import { getAuth } from 'firebase/auth';
import OrderService from '../../../services/OrderService';
import Header from '../../Header/Header';

const orderSteps = ['Order Placed', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setError('Please login to view order details');
          return;
        }

        const orderService = new OrderService(user.uid);
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <Box sx={{ p: 3 }}>Loading order details...</Box>;
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>{error}</Box>;
  if (!order) return <Box sx={{ p: 3 }}>Order not found</Box>;

  const getStepIndex = (status) => {
    const statusMap = {
      'placed': 0,
      'confirmed': 1,
      'shipped': 2,
      'out_for_delivery': 3,
      'delivered': 4
    };
    return statusMap[status] || 0;
  };

  return (
    <Box sx={{ p: 3, marginTop: '70px' }}>
      <Header />
      <Paper sx={{ p: 3, mb: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Order Details
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Order ID: {orderId}
        </Typography>

        <Box sx={{ my: 4 }}>
          <Stepper activeStep={getStepIndex(order.status)} alternativeLabel>
            {orderSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              {order.products && order.products.map((product, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                  <img
                    src={product.imageUrl || ''}
                    alt={product.title || 'Product Image'}
                    style={{ width: '100px', height: 'auto', marginRight: '16px' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <Box>
                    <Typography variant="subtitle1">{product.title || 'Product Title'}</Typography>
                    <Typography variant="body2">Author: {product.author || 'Unknown'}</Typography>
                    <Typography variant="body2">Quantity: {product.quantity || 1}</Typography>
                    <Typography variant="body2" color="primary">
                      Price: ₹{product.price * (product.quantity || 1)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                Total: ₹{order.totalAmount || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default OrderDetails;