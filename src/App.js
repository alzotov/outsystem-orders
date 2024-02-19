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
    console.log('Placing order for items:', items);
    // You can add your order placement logic here
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
