import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowBack, Add, Remove, Delete } from '@mui/icons-material';
import { auth } from '../../../firebase/config';
import CartService from '../../../services/CartService';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const cartService = new CartService(user.uid);
        const items = await cartService.getCart();
        setCartItems(items);
      } else {
        navigate('/user-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const updateQuantity = async (index, change) => {
    const user = auth.currentUser;
    if (user) {
      const cartService = new CartService(user.uid);
      const item = cartItems[index];
      await cartService.updateItemQuantity(item.id, change);
      const updatedCart = await cartService.getCart();
      setCartItems(updatedCart);
    }
  };

  const removeItem = async (index) => {
    const user = auth.currentUser;
    if (user) {
      const cartService = new CartService(user.uid);
      const item = cartItems[index];
      await cartService.removeItem(item.id);
      const updatedCart = await cartService.getCart();
      setCartItems(updatedCart);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const handleCheckout = () => {
    navigate('/order', {
      state: {
        products: cartItems,
        totalAmount: calculateTotal()
      }
    });
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-32 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-red-600" />
          My Shopping Cart
        </h1>
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
        >
          <ArrowBack className="h-5 w-5" />
          Continue Shopping
        </button>
      </div>
      
      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gray-50 rounded-2xl shadow-lg"
        >
          <div className="mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-2xl mb-4 font-semibold">Your cart is empty</p>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cartItems.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-center gap-6 mb-4 border border-gray-100 hover:transform hover:-translate-y-1"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-24 h-36 object-contain rounded-sm"
              />
              
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                <p className="text-gray-500 text-sm">By {item.author}</p>
                <p className="text-red-600 font-bold mt-2 text-lg">₹{item.price}</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border-r-2 border-gray-200 focus:outline-none active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      <Remove className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity || 1}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        const change = newQuantity - (item.quantity || 1);
                        if (newQuantity >= 1) {
                          updateQuantity(index, change);
                        }
                      }}
                      className="w-16 px-2 py-2 text-gray-800 font-medium bg-white text-center focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border-l-2 border-gray-200 focus:outline-none active:scale-95"
                      aria-label="Increase quantity"
                    >
                      <Add className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(index)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200 active:scale-95"
                    aria-label="Remove item"
                  >
                    <Delete className="h-5 w-5" />
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ₹{item.price * (item.quantity || 1)}
                </p>
              </div>
            </motion.div>
          ))}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100 sticky bottom-8"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)} items)</span>
                <span className="font-medium text-gray-800">₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t">
                <span className="text-gray-800">Total Amount</span>
                <span className="text-2xl font-bold text-gray-800">₹{calculateTotal()}</span>
              </div>
              
              <button
                className="w-full bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 transform hover:scale-[1.02] transition-all duration-200 font-semibold text-lg checkout-btn shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6"
                onClick={() => {
                  navigate('/order', {
                    state: {
                      products: cartItems,
                      totalAmount: calculateTotal()
                    }
                  });
                }}
              >
                <span>Proceed to Checkout</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                Free shipping on all orders. 30-day return policy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
      <Footer />
    </>
  );
};

export default Cart;