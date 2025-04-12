import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import CartService from '../../../services/CartService';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Home CSS for Nav-Bar and Footer

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => product.visibility === true); // Only include products with visibility set to true
      setProducts(productsList);
      setFilteredProducts(productsList);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleFilter = () => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    if (language) {
      filtered = filtered.filter(product => product.language === language);
    }

    if (minPrice) {
      filtered = filtered.filter(product => product.price >= minPrice);
    }

    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  const handleAddToCart = async (event, product) => {
    event.stopPropagation();
    if (!user) {
      navigate('/user-login');
      return;
    }

    try {
      const cartService = new CartService(user.uid);
      const success = await cartService.addItem(product);
      if (success) {
        setSnackbar({
          open: true,
          message: 'Item added to cart successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding item to cart',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="ml-3 text-lg text-gray-600">Loading Books...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Discover Your Next Book
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Filters
              </h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5"
                >
                  <option value="">All Categories</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science-Fiction">Science Fiction</option>
                  <option value="History">History</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Competitive-books">Competitive Books</option>
                  <option value="Self-help">Self-Help & Development</option>
                  <option value="Children's-Books">Children's Books</option>
                  <option value="bio-auto">Biography & Autobiography</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5"
                >
                  <option value="">All Languages</option>
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5"
                  placeholder="Enter minimum price"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5"
                  placeholder="Enter maximum price"
                />
              </div>
              <button
                onClick={handleFilter}
                className="w-full bg-red-600 text-white py-2.5 px-5 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={index} className="group">
                  <div 
                    onClick={() => handleProductClick(product.id)}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="relative pb-[60%] overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.title || 'No title available'}
                        className="absolute inset-0 w-full h-full object-contain p-4 transform group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600">
                        {product.title || 'No title available'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.author}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-red-600">
                          ₹{product.price}
                        </span>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
                          aria-label="Add to cart"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Footer />
    </div>
  );
}

export default Products;
