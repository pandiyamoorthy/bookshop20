import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { doc, getDoc, getDocs, collection } from "firebase/firestore"; // Import getDocs and collection
import { Box, Typography, Paper, Grid, Button, Breadcrumbs, Link as MuiLink, Rating, MenuItem, Select, FormControl, InputLabel, IconButton, InputBase, List, ListItem, ListItemText, ClickAwayListener } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);

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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredSuggestions = products.filter(product =>
        product.title.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit suggestions to 5
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await performSearch();
    }
  };

  const handleSearchClick = async () => {
    await performSearch();
  };

  const performSearch = async () => {
    navigate(`/search-results?search=${searchTerm}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    navigate(`/search-results?search=${suggestion.title}`);
    setSuggestions([]);
  };

  const handleClickAway = () => {
    setSuggestions([]);
  };

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

  const handleAddToWishlist = () => {
    // Add to wishlist logic here
    console.log("Added to wishlist:", product);
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(to right, #f8f9fa, #e9ecef)' }}>
      <section id="header">
        <a href="/"><img src="image/logo.jpg" alt="logo" width="30%"/></a>
        
        <div>
          <ul id="navbar">
            <li>
              <ClickAwayListener onClickAway={handleClickAway}>
                <Paper
                  ref={searchBoxRef}
                  component="form"
                  sx={{ display: 'flex', alignItems: 'center', width: 400, boxShadow: 1, borderRadius: 1, position: 'relative', overflow: 'visible' }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Books"
                    inputProps={{ 'aria-label': 'search books' }}
                    value={searchTerm}
                    onChange={handleSearch}
                    onKeyPress={handleKeyPress}
                  />
                  <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchClick}>
                    <SearchIcon />
                  </IconButton>
                  {suggestions.length > 0 && (
                    <List sx={{ position: 'absolute', top: '100%', left: 0, right: 0, bgcolor: 'background.paper', zIndex: 10, boxShadow: 3, borderRadius: 1 }}>
                      {suggestions.map((suggestion, index) => (
                        <ListItem button key={index} onClick={() => handleSuggestionClick(suggestion)}>
                          <ListItemText primary={suggestion.title} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </ClickAwayListener>
            </li>
            <li><a href="/" className="active">Home</a></li>
            <li><a href="/products">Books</a></li>
            <li><a href="/valid-url">About</a></li>
            <li className="dropdown">
              <a href="/valid-url" className="dropbtn">
                <AccountCircleIcon sx={{ mr: 1 }} />
              </a>
              <div className="dropdown-content">
                <Link to="/cart">Add to Cart</Link>
                <Link to="/wishlist">My Wishlist</Link>
                <Link to="/order-history">Order History</Link>
              </div>
            </li>
            <li><a href="/cart"><i className="fas fa-shopping-cart"></i></a></li> {/* Cart Icon */}
            <li><a href="/order-history"><i className="fas fa-box"></i></a></li> {/* Order Icon */}
            <li><a href="/valid-url" id="lg-bag"><i className="fal fa-shopping-bag"></i></a>
              <span className="quantity">0</span>
            </li>
            <li><a href="/valid-url" id="close"><i className="far fa-times"></i></a></li>
          </ul>
        </div>
        <div id="mobile">
          <a href="/valid-url"><i className="fal fa-shopping-bag"></i>
            <span className="quantity">0</span>
          </a>
          <i id="bar" className="fas fa-outdent"></i>
        </div>
      </section>

      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: '8px' }} className="product-details-container">
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
    </Box>
  );
}

export default ProductDetails;
