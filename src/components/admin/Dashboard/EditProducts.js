import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';

function EditProducts() {
  const { id } = useParams(); // Get product ID from URL
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [category, setCategory] = useState(""); // New state for category

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const product = docSnap.data();
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setImageUrl(product.imageUrl);
        setVisibility(product.visibility);
        setCategory(product.category);
      } else {
        setMessage("Product not found");
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        name,
        price,
        description,
        imageUrl,
        visibility,
        category // Include category in the product data
      });
      setMessage("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product: ", error);
      setMessage("Error updating product. Please try again.");
    }
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={visibility}
            onChange={(e) => setVisibility(e.target.checked)}
          />
          Publish
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select Category</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science-Fiction">Science-Fiction</option>
          <option value="History">History</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Competitive-books">Competitive books</option>
          <option value="Self-help">Self-Help-personal development</option>
          <option value="Children's-Books">Children's Books</option>
          <option value="bio-auto">Biography and Autobiography</option>
          {/* Add more categories as needed */}
        </select>
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EditProducts;
