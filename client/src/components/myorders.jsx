import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../components/Styles/myorders.css';

function Myorders() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const userId = sessionStorage.getItem("userid");
  const billRef = useRef();

  useEffect(() => {
    const url = `http://localhost:9000/myorders/${userId}`;
    axios.get(url)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [userId]);

  const generateBill = (product) => {
    const billContent = document.createElement('div');
    billContent.innerHTML = `
      <div class="bill-content">
        <h1>HOME DECOR</h1>
        <p><strong>Product Name:</strong> ${product.prodname}</p>
        <p><strong>Price:</strong> ₹${product.amount}</p>
        <p><strong>Quantity:</strong> ${product.quantity}</p>
        <p><strong>Status:</strong> ${product.status}</p>
      </div>
    `;

    // Append the bill content to the DOM and use html2canvas
    document.body.appendChild(billContent);

    html2canvas(billContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('bill.pdf');
      document.body.removeChild(billContent);
    });
  };

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {products.length > 0 ? (
        <div className="orders-list">
          {products.map((product) => (
            <div key={product._id} className="order-card">
              <img 
                src={`http://localhost:9000/uploads/${product.image}`}
                alt={product.prodname} 
                className="product-image" 
              />
              <div className="order-details">
                <h3>{product.prodname}</h3>
                <p>Price: ₹{product.amount}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Status: {product.status}</p>
              </div>
              <button onClick={() => generateBill(product)}>Generate Bill</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Myorders;
