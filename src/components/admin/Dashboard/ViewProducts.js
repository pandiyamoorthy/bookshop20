import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import { useHistory } from 'react-router-dom';

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('list'); // State to manage view type
  const history = useHistory();

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
    };
    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    history.push(`/edit-product/${id}`);
  };

  return (
    <div>
      <h1>View Products</h1>
      <div>
        <button onClick={() => setView('list')}>List View</button>
        <button onClick={() => setView('grid')}>Grid View</button>
      </div>
      {view === 'list' ? (
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} - ${product.price}
              <button onClick={() => handleEdit(product.id)}>Edit</button>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {products.map(product => (
            <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '200px' }}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => handleEdit(product.id)}>Edit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewProducts;
