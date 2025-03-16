import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function EditBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const booksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksList);
      setLoading(false);
    };

    fetchBooks();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredBooks = selectedCategory
    ? books.filter(book => book.category === selectedCategory)
    : books;

  if (loading) {
    return <p>Loading Books...</p>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Books
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="view-label">View</InputLabel>
          <Select
            labelId="view-label"
            value={view}
            onChange={handleViewChange}
            label="View"
          >
            <MenuItem value="grid">Grid View</MenuItem>
            <MenuItem value="list">List View</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Fiction">Fiction</MenuItem>
            <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
            <MenuItem value="Science-Fiction">Science-Fiction</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="Fantasy">Fantasy</MenuItem>
            <MenuItem value="Competitive-books">Competitive books</MenuItem>
            <MenuItem value="Self-help">Self-Help</MenuItem>
            <MenuItem value="Children's-Books">Children's Books</MenuItem>
            <MenuItem value="bio-auto">Biography and Autobiography</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {view === 'grid' ? (
        <Grid container spacing={3}>
          {filteredBooks.length === 0 ? (
            <Grid item xs={12}>
              <p>No Books found.</p>
            </Grid>
          ) : (
            filteredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={book.imageUrl}
                    alt={book.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {book.title}
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      ₹{book.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Visibility: {book.visibility ? "Public" : "Private"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {book.id}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Button variant="contained" onClick={() => handleEdit(book.id)}>
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
                <TableCell>ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No Books found.</TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <img src={book.imageUrl} alt={book.name} style={{ width: '50px', height: '50px' }} />
                    </TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>₹{book.price}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>{book.visibility ? "Public" : "Private"}</TableCell>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleEdit(book.id)}>
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
  );
}

export default EditBooks;
