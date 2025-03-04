import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminPage from './components/admin/AdminPage';
import Home from './components/users/Home/Home';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import UploadProducts from './components/admin/Dashboard/UploadProducts';
import OrderDetails from './components/admin/Dashboard/OrderDetails';
import ManageUsers from './components/admin/Dashboard/ManageUsers';
import Settings from './components/admin/Dashboard/Settings';
import Products from './components/users/Products/Products';
import ViewProduct from './components/admin/Dashboard/ViewProduct';
import EditProducts from './components/admin/Dashboard/EditProducts';
import Login from './Login';
import ProductDetails from './components/users/ProductDetails/ProductDetails'; // Import ProductDetails

function App() {
  const isAuthenticated = () => {
    // Replace this with actual authentication logic
    return !!localStorage.getItem('authToken');
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<AdminDashboard />} />}>
          <Route path="upload-products" element={<UploadProducts />} />
          <Route path="order-details" element={<OrderDetails />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="view-products" element={<ViewProduct />} />
          <Route path="edit-product/:id" element={<EditProducts />} />
        </Route>
        <Route path="/products" element={<Products />} />
        <Route path="/product-details/:id" element={<ProductDetails />} /> {/* Add this route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;

