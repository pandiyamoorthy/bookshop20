import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import CartService from '../../../services/CartService';
import { Box, Typography, Paper, Grid, Button, Breadcrumbs, Link as MuiLink, Rating, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import './ProductDetails.css';


function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

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

  const handleAddToCart = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      navigate('/user-login');
      return;
    }

    try {
      const cartService = new CartService(user.uid);
      const cartItem = {
        id,
        title: product.title,
        author: product.author,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      };
      
      await cartService.addItem(cartItem);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      navigate('/user-login');
      return;
    }
    const totalAmount = product.price * quantity;
    navigate('/order', { 
      state: { 
        products: [{
          id,
          title: product.title,
          author: product.author,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: quantity
        }],
        totalAmount: totalAmount
      } 
    });
  };

  const handleAddToWishlist = () => {
    // Add to wishlist logic here
    console.log("Added to wishlist:", product);
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(to right, #f8f9fa, #e9ecef)', marginTop: '70px' }}>
      <Header />

      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: '8px' , marginTop:'20px' }} className="product-details-container">
        <Grid container spacing={3}>
          <Grid item xs={12} md={5} sx={{ position: 'relative' }}>
            <img src={product.imageUrl} alt={product.title} className="product-image" style={{ width: '70%', height: 'auto', maxHeight: '400px', borderRadius: '8px' }} />
            {product.discount && (
              <Box sx={{ position: 'absolute', top: 0, left: 20, backgroundColor: 'red', color: 'white', p: 2, borderRadius: '4px', fontWeight: 'bold' }}>
                {product.discount}% OFF
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={7} className="product-details">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#343a40' }}>{product.title}</Typography>
            <MuiLink component={Link} to={`/author/${product.author}`} sx={{ textDecoration: 'none', color: '#007bff' }}>
              <Typography variant="h6" gutterBottom>{product.author}</Typography>
            </MuiLink>
            <Typography variant="body1" gutterBottom>Publisher: {product.publisher}</Typography>
            <Typography variant="body1" gutterBottom>Release Date: {product.releaseDate}</Typography>
            <Typography variant="body1" gutterBottom>Category: {product.category}</Typography>
            <Typography variant="body1" gutterBottom>Language: {product.language}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.5} sx={{ color: '#ffc107' }} />
              <Typography variant="body2" sx={{ ml: 1 }}>({product.reviewCount} reviews)</Typography>
            </Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'green' }}>Price: ₹{product.price}</Typography>
            <Typography variant="body2" gutterBottom sx={{ textDecoration: 'line-through' }}>₹{product.originalPrice}</Typography>
            <Typography variant="body2" gutterBottom sx={{ color: 'red', fontWeight: 'bold' }}>{product.offer}% OFF</Typography>
            <Typography variant="body1" gutterBottom>Availability: {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}</Typography>
            <Typography variant="body2" gutterBottom>Ships in 1-2 business days</Typography>
            <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>{product.description}</Typography>
            <MuiLink component={Link} to={`/product/${id}/details`} sx={{ textDecoration: 'none', color: '#007bff' }}>
              <Typography variant="body2">Read More</Typography>
            </MuiLink>
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel id="quantity-label">Quantity</InputLabel>
              <Select
                labelId="quantity-label"
                id="quantity"
                value={quantity}
                label="Quantity"
                onChange={(e) => setQuantity(e.target.value)}
              >
                {[...Array(product.stockQuantity).keys()].map((x) => (
                  <MenuItem key={x + 1} value={x + 1}>{x + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 2 }}>
              <Button variant="contained" color="success" onClick={handleAddToCart} sx={{ flexGrow: 1 }}>
                Add to Cart
              </Button>
              <Button variant="contained" sx={{ backgroundColor: 'orange', color: 'white', flexGrow: 1 }} onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button variant="outlined" sx={{ borderColor: '#007bff', color: '#007bff', flexGrow: 1 }} onClick={handleAddToWishlist}>
                Add to Wishlist
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Footer />
    </Box>
  );
}

export default ProductDetails;
