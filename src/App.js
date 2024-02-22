import React, { useState } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemWeight, setItemWeight] = useState('');
  const [orderResult, setOrderResult] = useState(null);  

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
    const result = {
      packages: [
        {
          packageId: 1,
          items: [
            { name: 'Item 1', price: 10, weight: '0.5kg' },
            { name: 'Item 2', price: 15, weight: '0.7kg' },
          ],
          totalCost: 25,
          totalWeight: 1.2,
        },
        {
          packageId: 2,
          items: [
            { name: 'Item 3', price: 20, weight: '1kg' },
          ],
          totalCost: 20,
          totalWeight: 1,
        },
      ],
    };

    setOrderResult(result);
    
    if (items.length === 0) {
      console.log('No items to place order.');
      return;
    }

    const apiUrl = 'http://localhost:3001/api/orders'; // Update with your actual backend URL

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
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>{item.weight}</td>
                <td>
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handlePlaceOrder} disabled={items.length === 0}>
          Place Order
        </button>
      </div>
      {orderResult && (
        <div>
          <h2>Order Result</h2>
          <table>
            <thead>
              <tr>
                <th>Package ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Weight</th>
                <th>Total Cost</th>
                <th>Total Weight</th>
              </tr>
            </thead>
            <tbody>
              {orderResult.packages.map((packageInfo) => (
                packageInfo.items.map((item, index) => (
                  <tr key={index}>
                    {index === 0 && (
                      <>
                        <td rowSpan={packageInfo.items.length}>{packageInfo.packageId}</td>
                        <td>{item.name}</td>
                        <td>${item.price}</td>
                        <td>{item.weight}</td>
                        <td rowSpan={packageInfo.items.length}>${packageInfo.totalCost}</td>
                        <td rowSpan={packageInfo.items.length}>{packageInfo.totalWeight}kg</td>
                      </>
                    )}
                    {index !== 0 && (
                      <>
                        <td>{item.name}</td>
                        <td>${item.price}</td>
                        <td>{item.weight}</td>
                      </>
                    )}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}    
    </div>
  );
}

export default App;
