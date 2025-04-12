import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    paymentMethod: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [updateStatus, setUpdateStatus] = useState({ loading: false, error: null });

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdateStatus({ loading: true, error: null });
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      setUpdateStatus({ loading: false, error: error.message });
    } finally {
      setUpdateStatus({ loading: false, error: null });
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !filter.status || order.status === filter.status;
    const matchesPayment = !filter.paymentMethod || order.paymentMethod === filter.paymentMethod;
    const matchesSearch = !searchQuery || 
      order.address.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPayment && matchesSearch;
  });

  if (loading) {
    return <Typography>Loading orders...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Manage Users</Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search by Order ID or Customer Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filter.status}
            label="Status"
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={filter.paymentMethod}
            label="Payment Method"
            onChange={(e) => setFilter(prev => ({ ...prev, paymentMethod: e.target.value }))}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="cod">Cash on Delivery</MenuItem>
            <MenuItem value="card">Card</MenuItem>
            <MenuItem value="upi">UPI</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.address.fullName}</TableCell>
                <TableCell>
                  {order.products ? (
                    <>
                      {order.products[0]?.title || 'N/A'}
                      {order.products.length > 1 && ` +${order.products.length - 1} more`}
                    </>
                  ) : 'N/A'}
                </TableCell>
                <TableCell>
                  {order.products ? order.products.reduce((total, product) => total + (product.quantity || 0), 0) : 'N/A'}
                </TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell>{order.paymentMethod.toUpperCase()}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    size="small"
                    sx={{
                      color: order.status === 'delivered' ? 'green' :
                             order.status === 'pending' ? 'orange' : 'inherit'
                    }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default OrderDetails;
