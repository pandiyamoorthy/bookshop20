import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { IconButton, Button, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './ViewProduct.css'; // Import the CSS file

function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isGridView, setIsGridView] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched products:", productsList); // Debugging log
        setProducts(productsList);

        // Calculate category counts
        const counts = productsList.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});
        setCategoryCounts(counts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter(product => product.id !== id));
      console.log(`Product with id ${id} deleted`); // Debugging log
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  if (loading) {
    return <p>Loading Books...</p>;
  }

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Books Summary
        </Typography>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Total Books: {products.length}</Typography>
          <Grid container spacing={2}>
            {Object.keys(categoryCounts).map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Typography
                  variant="body1"
                  onClick={() => handleCategoryClick(category)}
                  style={{ cursor: 'pointer', color: selectedCategory === category ? 'blue' : 'black' }}
                >
                  {category}: {categoryCounts[category]}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Button variant="contained" color="success" onClick={toggleView}>
            {isGridView ? 'Switch to List View' : 'Switch to Grid View'}
          </Button>
        </div>
        {isGridView ? (
          <Grid container spacing={2} className="grid-view" sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {filteredProducts.length === 0 ? (
              <Grid item xs={12}>
                <p>No Books found.</p>
              </Grid>
            ) : (
              filteredProducts.map((product) => (
                <Grid item xs={12} sm={0} md={3} key={product.id} className="product-card">
                  <Paper sx={{ p: 5, boxShadow: 5, border: '2px solid #ddd' }}>
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2">{product.description}</Typography>
                    <Typography variant="body1">₹{product.price}</Typography>
                    <Typography variant="body2">Visibility: {product.visibility ? "Public" : "Private"}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <IconButton aria-label="delete" size="large" onClick={() => handleDelete(product.id)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                      <Button variant="contained" href={`/edit-product/${product.id}`}>
                        Edit
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Book Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>No Books found.</TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px' }} />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.visibility ? "Public" : "Private"}</TableCell>
                      <TableCell>
                        <IconButton aria-label="delete" size="large" onClick={() => handleDelete(product.id)}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                        <Button variant="contained" href={`/edit-product/${product.id}`}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </div>
  );
}

export default ViewProduct;
