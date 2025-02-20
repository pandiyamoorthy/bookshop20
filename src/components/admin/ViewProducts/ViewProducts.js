import { Grid } from '@mui/material';

function ViewProducts() {
  return (
    <div>
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={4} md={4} key={book.id}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
