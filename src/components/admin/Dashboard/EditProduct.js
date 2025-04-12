import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, Alert, Box, Typography, Grid, Paper, Container, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Radio, RadioGroup, FormLabel, FormControl } from '@mui/material';
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
    imageOption: 'url',
    imageFile: null,
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
    if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, imageFile: file });
      }
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleImageOptionChange = (e) => {
    setFormData({ ...formData, imageOption: e.target.value, imageFile: null });
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
      let imageUrl = formData.imageUrl;
      if (formData.imageOption === 'file' && formData.imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}-${formData.imageFile.name}`);
        await uploadBytes(storageRef, formData.imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      const updateData = { ...formData, imageUrl };
      delete updateData.imageOption;
      delete updateData.imageFile;
      await updateDoc(doc(db, "products", id), updateData);
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

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "products", id));
      setMessage({ type: "success", text: "Product deleted successfully!" });
      setOpenSnackbar(true);
      setTimeout(() => navigate('/admin/edit-books'), 2000);
    } catch (error) {
      console.error("Error deleting product: ", error);
      setMessage({ type: "error", text: `Error deleting product: ${error.message}` });
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3 }}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={message.text}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        <Typography variant="h4" gutterBottom>
          Edit Books
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledPaper>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleOpenDeleteDialog}
                    sx={{ mr: 2 }}
                  >
                    Delete Book
                  </Button>
                </Box>
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
                <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
                  <FormLabel component="legend">Image Source</FormLabel>
                  <RadioGroup
                    row
                    aria-label="image-source"
                    name="imageOption"
                    value={formData.imageOption}
                    onChange={handleImageOptionChange}
                  >
                    <FormControlLabel value="url" control={<Radio />} label="Image URL" />
                    <FormControlLabel value="file" control={<Radio />} label="Upload Image" />
                  </RadioGroup>
                </FormControl>
                {formData.imageOption === 'url' ? (
                  <TextField
                    label="Image URL"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                ) : (
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </Button>
                )}
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

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Book"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this book? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default EditProduct;