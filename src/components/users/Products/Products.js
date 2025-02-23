import React, { useEffect, useState } from 'react';
import './Products.css';
import { db } from '../../../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Grid, Typography, Paper } from '@mui/material';
import '../Home/Home.css'; // Import Home CSS for Nav-Bar and Footer

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs
        .map(doc => doc.data())
        .filter(product => product.visibility === true); // Only include products with visibility set to true
      setProducts(productsList);
      setFilteredProducts(productsList);
    };

    fetchProducts();
  }, []);

  const handleFilter = () => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    if (minPrice) {
      filtered = filtered.filter(product => product.price >= minPrice);
    }

    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    setFilteredProducts(filtered);
  };

  return (
    <div>
      <section id="header">
        <a href="/"><img src="image/logo.jpg" alt="logo" width="25%" /></a>
        <input type="text" placeholder="Search Books" id="search-bar" />

        <div>
          <ul id="navbar">
            <li><a href="/" >Home</a></li>
            <li><a href="/products" className="active">Books</a></li>
            <li><a href="/valid-url">About</a></li>
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
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Products Page
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, position: 'sticky', top: '80px', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Fiction">Fiction</MenuItem>
                  <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                  <MenuItem value="Science-Fiction">Science-Fiction</MenuItem>
                  <MenuItem value="History">History</MenuItem>
                  <MenuItem value="Fantasy">Fantasy</MenuItem>
                  <MenuItem value="Competitive-books">Competitive books</MenuItem>
                  <MenuItem value="Self-help">Self-Help-personal development</MenuItem>
                  <MenuItem value="Children's-Books">Children's Books</MenuItem>
                  <MenuItem value="bio-auto">Biography and Autobiography</MenuItem>
                  {/* Add more categories as needed */}
                </Select>
              </FormControl>
              <TextField
                label="Min Price"
                type="number"
                fullWidth
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Max Price"
                type="number"
                fullWidth
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleFilter} fullWidth>
                Apply Filters
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {filteredProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper className="uiverse-card">
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2">{product.author}</Typography>
                    <Typography variant="body1">₹{product.price}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <footer className="section-p1">
        <div className="col">
          <a href="/"><img className="logo" src="image/logo.jpg" alt="logo" width="10%"/></a>
          <h4>Contact</h4>
          <p><strong>Address:</strong> 349, Olorilogbon street, Onigbogbo Lagos</p>
          <p><strong>Phone:</strong> +23456876199, +23458903120</p>
          <p><strong>Hours:</strong> 10.00 - 18.00, Mon - Sat</p>
          <div className="follow">
            <h4>Follow Us</h4>
            <div className="icon">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-youtube"></i>
              <i className="fab fa-pinterest-p"></i>
            </div>
          </div>
        </div>
        <div className="sec">
          <div className="col">
            <h4>About</h4>
            <a href="/valid-url">About Us</a>
            <a href="/valid-url">Delivery Information</a>
            <a href="/valid-url">Privacy Policy</a>
            <a href="/valid-url">Terms and Condition</a>
            <a href="/valid-url">Contact Us</a>
          </div>
          <div className="col">
            <h4>My Account</h4>
            <a href="/valid-url">Sign In</a>
            <a href="/valid-url">View Cart</a>
            <a href="/valid-url">My Account</a>
            <a href="/valid-url">My Wishlist</a>
            <a href="/valid-url">Track my Order</a>
            <a href="/valid-url">Help</a>
          </div>
          <div className="col install">
            <h4>Install App</h4>
            <p>From App Store or Google Play</p>
            <div className="row">
              <img src="https://i.postimg.cc/Y2s5mLdR/app.jpg" alt="" />
              <img src="https://i.postimg.cc/7YvyWTS6/play.jpg" alt="" />
            </div>
            <p>Secured Payment Gateways</p>
            <img src="https://i.postimg.cc/kgfzqVRW/pay.png" alt="" />
          </div>
        </div>
        <div className="coypright">
          <p>© 2023 All rights reserved! made by Tunrayo</p>
        </div>
      </footer>
    </div>
  );
}

export default Products;
