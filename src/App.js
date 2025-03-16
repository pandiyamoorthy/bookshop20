import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import AdminPage from './components/admin/AdminPage';
import Home from './components/users/Home/Home';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import UploadProducts from './components/admin/Dashboard/UploadProducts';
import OrderDetails from './components/admin/Dashboard/OrderDetails';
import ManageUsers from './components/admin/Dashboard/ManageUsers';
import Settings from './components/admin/Dashboard/Settings';
import Products from './components/users/Products/Products';
import ViewProduct from './components/admin/Dashboard/ViewProduct';
import EditProduct from './components/admin/Dashboard/EditProduct';
import EditBooks from './components/admin/Dashboard/EditBooks';
import Login from './Login';
import ProductDetails from './components/users/ProductDetails/ProductDetails';
import SearchResults from './components/users/SearchResults/SearchResults'; // Import SearchResults

function App() {
  const isAuthenticated = () => {
    // Replace this with actual authentication logic
    return !!localStorage.getItem('authToken');
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" />;
  };

  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<AdminDashboard />} />}>
            <Route path="upload-products" element={<UploadProducts />} />
            <Route path="order-details" element={<OrderDetails />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="view-products" element={<ViewProduct />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="edit-books" element={<EditBooks />} />
          </Route>
          <Route path="/products" element={<Products />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/search-results" element={<SearchResults />} /> {/* Add this route */}
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;

