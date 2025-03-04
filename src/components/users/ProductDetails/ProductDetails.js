import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { doc, getDoc } from "firebase/firestore";
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading Book Details...</p>;
  }

  if (!product) {
    return <p>Book not found.</p>;
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Added to cart:", product);
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log("Buy now:", product);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }} className="product-details-container">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <img src={product.imageUrl} alt={product.title} className="product-image" />
          </Grid>
          <Grid item xs={12} md={6} className="product-details">
          <Typography variant="h4" gutterBottom>{product.name}</Typography>

            <Typography variant="h4" gutterBottom>{product.title}</Typography>
            <Typography variant="h6" gutterBottom>Author: {product.author}</Typography>
            <Typography variant="body1" gutterBottom>Price: ₹{product.price}</Typography>
            <Typography variant="body1" gutterBottom>Category: {product.category}</Typography>
            <Typography variant="body1" gutterBottom>Stock Quantity: {product.stockQuantity}</Typography>
            <Typography variant="body1" gutterBottom>Publisher: {product.publisher}</Typography>
            <Typography variant="body1" gutterBottom>Language: {product.language}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>Description: {product.description}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white' }} onClick={handleBuyNow}>
              Buy Now
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default ProductDetails;
