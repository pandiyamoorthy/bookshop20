import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';

const categories = [
  {
    name: 'Fiction',
    subcategories: ['Mystery', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller']
  },
  {
    name: 'Non-Fiction',
    subcategories: ['Biography', 'History', 'Self-Help', 'Business', 'Science']
  },
  {
    name: 'Academic',
    subcategories: ['Engineering', 'Medical', 'Law', 'Arts', 'Commerce']
  },
  {
    name: 'Children',
    subcategories: ['Picture Books', 'Early Readers', 'Middle Grade', 'Young Adult']
  },
  {
    name: 'Magazines',
    subcategories: ['Lifestyle', 'Technology', 'Fashion', 'Sports', 'News']
  }
];

const CategoryNav = () => {
  const [openCategory, setOpenCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  return (
    <Box
      className="category-nav"
      sx={{
        backgroundColor: '#232f3e',
        color: 'white',
        width: '100%',
        padding: '0.5rem 0',
      }}
    >
      <List
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          margin: 0,
          padding: 0,
          '& > *': { flex: '0 0 auto' },
        }}
      >
        {categories.map((category) => (
          <ListItem
            key={category.name}
            onMouseEnter={() => handleCategoryClick(category.name)}
            onMouseLeave={() => handleCategoryClick(null)}
            sx={{
              position: 'relative',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#37475a',
              },
            }}
          >
            <ListItemText primary={category.name} />
            <IconButton
              size="small"
              sx={{ color: 'white', padding: 0, marginLeft: 0.5 }}
            >
              {openCategory === category.name ? (
                <KeyboardArrowDown fontSize="small" />
              ) : (
                <KeyboardArrowRight fontSize="small" />
              )}
            </IconButton>

            <Collapse
              in={openCategory === category.name}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1000,
                backgroundColor: 'white',
                minWidth: '200px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              }}
            >
              <List>
                {category.subcategories.map((subcat) => (
                  <ListItem
                    key={subcat}
                    sx={{
                      color: '#333',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemText primary={subcat} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategoryNav;