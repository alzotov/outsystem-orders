import React, { useState } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemWeight, setItemWeight] = useState('');

  const addItem = () => {
    if (itemName && itemPrice && itemWeight) {
      setItems([
        ...items,
        {
          id: items.length + 1,
          name: itemName,
          price: parseFloat(itemPrice),
          weight: itemWeight,
        },
      ]);
      setItemName('');
      setItemPrice('');
      setItemWeight('');
    }
  };

  const removeItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      console.log('No items to place order.');
      return;
    }
  
    const apiUrl = 'http://localhost:3000/api/orders'; // Update with your actual backend URL
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Order placed successfully:', data);
        // Add any additional logic based on the API response
      })
      .catch((error) => {
        console.error('Error placing order:', error);
        // Handle errors, display a message to the user, etc.
      });
  };

  return (
    <div className="App">
      <h1>Please fill the order:</h1>
      <div>
        <label>
          Name:
          <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
        </label>
        <label>
          Price ($):
          <input type="text" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
        </label>
        <label>
          Weight (g):
          <input type="text" value={itemWeight} onChange={(e) => setItemWeight(e.target.value)} />
        </label>
        <button onClick={addItem}>Add Item</button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} - ${item.price} - {item.weight}g
            </span>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handlePlaceOrder} disabled={items.length === 0}>
        Place Order
      </button>
    </div>
  );
}

export default App;
