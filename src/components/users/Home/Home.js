import React, { useState, useEffect } from 'react';
import './Home.css';
import ImageSlider from './ImageSlider';
import CategoryNav from './CategoryNav';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [topSellingBooks, setTopSellingBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(product => product.visibility === true);
      
      setProducts(productsList);
      
      // Set featured books (books with high ratings)
      const featured = productsList
        .filter(product => product.rating >= 4.5)
        .slice(0, 4);
      setFeaturedBooks(featured);
      
      // Set trending books (most reviewed books)
      const trending = productsList
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 4);
      setTrendingBooks(trending);

      // Set top selling books (from top-selling category)
      const topSelling = productsList
        .filter(product => product.category === 'top-selling')
        .slice(0, 4);
      setTopSellingBooks(topSelling);
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  const BookCard = ({ product }) => (
    <div
      onClick={() => handleProductClick(product.id)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
    >
      <div className="relative h-56 w-full bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.title || 'No title available'}
          className="w-full h-full object-contain p-4"
        />
        {product.offer && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold transform rotate-3 shadow-md">
            {product.offer}% OFF
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {product.title || 'No title available'}
        </h3>
        <p className="text-sm text-gray-600 mb-3 italic">
          by {product.author}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-red-600">
              ₹{product.price}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </p>
            )}
          </div>
          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {product.category}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <CategoryNav />
      <ImageSlider />

      <div className="container mx-auto px-4 py-12">
        

        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Top Selling Books
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topSellingBooks.map((product, index) => (
              <BookCard key={index} product={product} />
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Top Trending Books
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingBooks.map((product, index) => (
              <BookCard key={index} product={product} />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mb-16 transform hover:scale-[1.02] transition-transform duration-300 shadow-xl">
          <h2 className="text-4xl font-bold mb-6 text-center">Welcome to Barathy Books</h2>
          <p className="text-xl mb-12 text-center text-blue-100">Discover a world of knowledge with our carefully curated collection of books.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-colors duration-300">
              <h3 className="text-2xl font-semibold mb-4">Wide Selection</h3>
              <p className="text-blue-100">Browse through thousands of titles across multiple genres</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-colors duration-300">
              <h3 className="text-2xl font-semibold mb-4">Best Prices</h3>
              <p className="text-blue-100">Get the best deals on your favorite books</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-colors duration-300">
              <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-blue-100">Quick and reliable delivery to your doorstep</p>
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Search Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <BookCard key={index} product={product} />
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
