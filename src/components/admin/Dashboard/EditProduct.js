import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, Alert, Box, Typography, Grid, Paper, Container, Snackbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    originalPrice: '',
    offer: '',
    category: '',
    description: '',
    stockQuantity: '',
    publisher: '',
    language: '',
    imageUrl: '',
    visibility: false
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [categories] = useState([
    "Fiction", "Non-Fiction", "Science-Fiction", "History", "Fantasy", 
    "Competitive-books", "Self-help", "Children's-Books", "bio-auto"
  ]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          console.error(`No product found with ID: ${id}`);
          setMessage({ type: "error", text: "Product not found." });
        }
      } catch (error) {
        console.error("Error fetching product: ", error);
        setMessage({ type: "error", text: `Error fetching product: ${error.message}` });
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.title || !formData.author || !formData.price || !formData.category) {
      setMessage({ type: "error", text: "Title, Author, Price, and Category are required fields." });
      return false;
    }
    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      setMessage({ type: "error", text: "Price must be a valid number greater than 0." });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateDoc(doc(db, "products", id), { ...formData });
      setMessage({ type: "success", text: "Product updated successfully!" });
      setOpenSnackbar(true);
      setTimeout(() => navigate('/admin/view-products'), 2000);
    } catch (error) {
      console.error("Error updating product: ", error);
      setMessage({ type: "error", text: `Error updating product: ${error.message}` });
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3 }}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={message.text}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Display at the bottom of the page
        />
        <Typography variant="h4" gutterBottom>
          Edit Books
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledPaper>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Book Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Price (₹)"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  type="number"
                />
                <TextField
                  label="Original Price (₹)"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  type="number"
                />
                <TextField
                  label="Offer (%)"
                  name="offer"
                  value={formData.offer}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  type="number"
                />
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
                <TextField
                  label="Stock Quantity"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  type="number"
                />
                <TextField
                  label="Publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="visibility"
                      checked={formData.visibility}
                      onChange={handleChange}
                    />
                  }
                  label="Publish on user product side"
                />
                <StyledButton type="submit" variant="contained" fullWidth>
                  Update
                </StyledButton>
              </form>
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default EditProduct;
