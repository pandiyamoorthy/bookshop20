import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { IconButton, Button, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import './ViewProduct.css'; // Import the CSS file

function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isGridView, setIsGridView] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      console.log(`Product with id ${id} deleted`); // Debugging log
      setProducts(products.filter(product => product.id !== id)); // Update state to remove deleted product
      fetchProducts(); // Refetch data after deletion
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

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

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
          <Grid container spacing={3}>
            {filteredProducts.length === 0 ? (
              <Grid item xs={12}>
                <p>No Books found.</p>
              </Grid>
            ) : (
              filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.imageUrl}
                      alt={product.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {product.title}
                      </Typography>
                      
                      <Typography variant="body1" color="text.primary">
                        ₹{product.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Visibility: {product.visibility ? "Public" : "Private"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {product.id}
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                      <IconButton aria-label="delete" size="large" onClick={async () => {
                        await handleDelete(product.id);
                      }}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                      <Button variant="contained" onClick={() => handleEdit(product.id)}>
                        Edit
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Book Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>ID</TableCell> {/* Add ID column */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>   
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>No Books found.</TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px' }} />
                      </TableCell>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.visibility ? "Public" : "Private"}</TableCell>
                      <TableCell>{product.id}</TableCell> {/* Display product ID */}
                      <TableCell>
                        <IconButton aria-label="delete" size="large" onClick={async () => {
                          await handleDelete(product.id);
                          setProducts(products.filter(p => p.id !== product.id)); // Update state to remove deleted product
                          fetchProducts(); // Refetch data after deletion
                        }}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                        <Button variant="contained" onClick={() => handleEdit(product.id)}>
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
