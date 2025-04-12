import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Stepper, Step, StepLabel, Typography, Paper, Button, Grid, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Snackbar, Alert } from '@mui/material';
import Header from '../../Header/Header';
import { getAuth } from 'firebase/auth';
import OrderService from '../../../services/OrderService';
import CartService from '../../../services/CartService';
import gPayQRCode from './gpay-qr.svg';

const steps = ['Order Summary', 'Delivery Address', 'Payment Method', 'Place Order'];

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [orderData, setOrderData] = useState({
    products: location.state?.products || [],
    totalAmount: location.state?.totalAmount || 0,
    address: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    },
    paymentMethod: 'cod'
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setOrderData(prev => ({
      ...prev,
      paymentMethod: e.target.value
    }));
  };

  const handlePlaceOrder = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to place an order',
        severity: 'error'
      });
      navigate('/user-login');
      return;
    }

    try {
      const orderService = new OrderService(user.uid);
      const orderDetails = {
        products: orderData.products,
        address: orderData.address,
        paymentMethod: orderData.paymentMethod,
        totalAmount: orderData.totalAmount,
        paymentStatus: 'completed'
      };

      const result = await orderService.createOrder(orderDetails);
      
      if (result.success) {
        const cartService = new CartService(user.uid);
        await Promise.all(orderData.products.map(product => cartService.removeItem(product.id)));
        
        setSnackbar({
          open: true,
          message: 'Order placed successfully!',
          severity: 'success'
        });
        setActiveStep(4); // Move to confirmation step
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to place order. Please try again.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while placing your order',
        severity: 'error'
      });
    }
  };

  const OrderSummary = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Order Summary</Typography>
      {orderData.products.map((product, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <img 
              src={product.imageUrl} 
              alt={product.title}
              style={{ width: '100%', maxWidth: '150px' }}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h6">{product.title}</Typography>
            <Typography variant="body1">Author: {product.author}</Typography>
            <Typography variant="body1">Quantity: {product.quantity || 1}</Typography>
            <Typography variant="body2" color="primary">
              Price: ₹{product.price * (product.quantity || 1)}
            </Typography>
          </Grid>
        </Grid>
      ))}
      <Typography variant="h6" color="primary" sx={{ mt: 2, textAlign: 'right' }}>
        Total Amount: ₹{orderData.totalAmount}
      </Typography>
    </Paper>
  );

  const DeliveryAddress = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Delivery Address</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="fullName"
            value={orderData.address.fullName}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address Line 1"
            name="addressLine1"
            value={orderData.address.addressLine1}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address Line 2"
            name="addressLine2"
            value={orderData.address.addressLine2}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={orderData.address.city}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="State"
            name="state"
            value={orderData.address.state}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="PIN Code"
            name="pincode"
            value={orderData.address.pincode}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            name="phone"
            value={orderData.address.phone}
            onChange={handleAddressChange}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const PaymentMethod = () => {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Payment Method</Typography>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select a payment method</FormLabel>
          <RadioGroup
            name="paymentMethod"
            value={orderData.paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <FormControlLabel 
              value="cod" 
              control={<Radio />} 
              label="Cash on Delivery" 
            />
            <FormControlLabel 
              value="gpay" 
              control={<Radio />} 
              label="Google Pay" 
            />
          </RadioGroup>
        </FormControl>

        {orderData.paymentMethod === 'gpay' && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Scan QR Code to Pay</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Scan the QR code below using Google Pay app to complete your payment
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <img
                src={gPayQRCode.replace('{{amount}}', orderData.totalAmount)}
                alt="Barathy Book Shop Google Pay QR Code"
                style={{ width: '200px', height: '200px' }}
              />
            </Box>
            <Typography variant="subtitle1" gutterBottom>Or pay using UPI ID</Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                bgcolor: '#f5f5f5', 
                p: 2, 
                borderRadius: 1,
                display: 'inline-block'
              }}
            >
              barathybooks@okbank
            </Typography>
          </Box>
        )}
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 3, marginTop: '70px' }}>

      <Header />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && <OrderSummary />}
        {activeStep === 1 && <DeliveryAddress />}
        {activeStep === 2 && <PaymentMethod />}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
          >
            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Order;