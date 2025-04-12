import React, { useState } from 'react';
import { db, storage } from '../../../firebase/config';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as XLSX from 'xlsx';
import { TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, Alert, Box, Typography, Grid, Paper, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material';
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

function UploadProducts() {
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
  const [message, setMessage] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    "Fiction", "Non-Fiction", "Science-Fiction", "History", "Fantasy", 
    "Competitive-books", "Self-help", "Children's-Books", "bio-auto"
  ]);
  const [imageOption, setImageOption] = useState('url');
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageOptionChange = (e) => {
    setImageOption(e.target.value);
    setFormData({ ...formData, imageUrl: '' });
    setImageFile(null);
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;
      if (imageOption === 'file' && imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, "products"), { ...formData, imageUrl });
      setMessage("Product uploaded successfully!");
      setTimeout(() => setMessage(""), 5000);
      setFormData({
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
      setImageFile(null);
    } catch (error) {
      console.error("Error uploading product: ", error);
      setMessage(`Error uploading product: ${error.message}`);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        for (const product of jsonData) {
          await addDoc(collection(db, "products"), {
            title: product.title,
            author: product.author,
            price: product.price,
            originalPrice: product.originalPrice,
            offer: product.offer,
            category: product.category,
            description: product.description,
            stockQuantity: product.stockQuantity,
            publisher: product.publisher,
            language: product.language,
            imageUrl: product.imageUrl,
            visibility: product.visibility
          });
        }
        setBulkMessage("Bulk upload successful!");
      } catch (error) {
        console.error("Error uploading products: ", error);
        setBulkMessage(`Error uploading products: ${error.message}`);
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file: ", error);
      setBulkMessage(`Error reading file: ${error.message}`);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {message && (
        <Alert severity={message.includes("successfully") ? "success" : "error"} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <Typography variant="h4" gutterBottom>
        Upload Products
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Book Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Price (₹)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Original Price (₹)"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Offer (%)"
                name="offer"
                value={formData.offer}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
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
              />
              <TextField
                label="Stock Quantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                fullWidth
                margin="normal"
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
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Image Source</FormLabel>
                <RadioGroup
                  row
                  aria-label="image-source"
                  name="image-source"
                  value={imageOption}
                  onChange={handleImageOptionChange}
                >
                  <FormControlLabel value="url" control={<Radio />} label="Image URL" />
                  <FormControlLabel value="file" control={<Radio />} label="Upload Image" />
                </RadioGroup>
              </FormControl>
              {imageOption === 'url' ? (
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
                    onChange={handleImageFileChange}
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
                Upload
              </StyledButton>
            </form>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h5" gutterBottom>
              Bulk Upload
            </Typography>
            <input type="file" accept=".csv, .xlsx, .xls" onChange={handleBulkUpload} />
            {bulkMessage && (
              <Alert severity={bulkMessage.includes("successful") ? "success" : "error"} sx={{ mt: 2 }}>
                {bulkMessage}
              </Alert>
            )}
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h5" gutterBottom>
              Add New Category
            </Typography>
            <TextField
              label="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
              margin="normal"
            />
            <StyledButton onClick={handleAddCategory} variant="contained" fullWidth>
              Add Category
            </StyledButton>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UploadProducts;
