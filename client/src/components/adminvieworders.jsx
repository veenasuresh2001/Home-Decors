import React from 'react';
import axios from 'axios';
import './adminvieworders.css';
import { useState, useEffect } from 'react';

function Allorders() {
  const [products, setProducts] = useState([]);
  const userId = sessionStorage.getItem("userid");

  useEffect(() => {
    const url = "http://localhost:9000/allorders";
    axios.get(url)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [userId]);

  return (
    <div className="orders-container">
      <h2>All Orders</h2>
      {products.length > 0 ? (
        <div className="orders-list">
          {products.map((product) => (
            <div key={product._id} className="order-card">
              <div className="order-details">
                <h3>{product.prodname}</h3>
                <div className="product-info">
    <p className="info-item"><span className="label">Customer Name:</span> {product.username}</p>
    <p className="info-item"><span className="label">Product Name:</span> {product.prodname}</p>
    <p className="info-item"><span className="label">Total Amount:</span> ${product.amount}</p>
    <p className="info-item"><span className="label">Quantity:</span> {product.quantity}</p>
    <p className="info-item"><span className="label">Status:</span> {product.status}</p>
</div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Allorders;
