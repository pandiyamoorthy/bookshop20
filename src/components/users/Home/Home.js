import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid, Card, CardContent, CardMedia, Typography, InputBase, IconButton, Paper, List, ListItem, ListItemText, ClickAwayListener } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import AccountCircleIcon

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);

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

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  const handleClickAway = () => {
    setSuggestions([]);
  };

  return (
    <div>
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

      {filteredProducts.length > 0 && (
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
      )}
    </div>
  );
};

export default Home;
