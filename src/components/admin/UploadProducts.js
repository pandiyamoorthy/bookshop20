import React, { useState } from 'react';

function UploadProducts() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editCategory, setEditCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleEditCategory = (index) => {
    setEditIndex(index);
    setEditCategory(categories[index]);
  };

  const handleSaveEditCategory = () => {
    const updatedCategories = [...categories];
    updatedCategories[editIndex] = editCategory.trim();
    setCategories(updatedCategories);
    setEditIndex(null);
    setEditCategory('');
  };

  const handleDeleteCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  return (
    <div>
      <div>
        <input 
          type="text" 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)} 
          placeholder="Enter new category" 
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            {editIndex === index ? (
              <>
                <input 
                  type="text" 
                  value={editCategory} 
                  onChange={(e) => setEditCategory(e.target.value)} 
                />
                <button onClick={handleSaveEditCategory}>Save</button>
              </>
            ) : (
              <>
                {category}
                <button onClick={() => handleEditCategory(index)}>Edit</button>
                <button onClick={() => handleDeleteCategory(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UploadProducts;
