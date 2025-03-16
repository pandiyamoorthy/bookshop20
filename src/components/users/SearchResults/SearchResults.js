import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [location.search, products]);

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {filteredProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ mb: 3 }}>
            <Card 
              onClick={() => handleProductClick(product.id)} 
              className="product-card" 
              sx={{ cursor: 'pointer', backgroundColor: '#f0f0f0' }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.title || 'No title available'}
                sx={{ objectFit: 'contain' }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {product.title || 'No title available'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.author}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  ₹{product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchResults;
