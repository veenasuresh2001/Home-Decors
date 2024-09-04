import React, { useState, useEffect } from 'react';
import '../components/Styles/buyaddress.css';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

function Buyaddress() {
    const navigate=useNavigate()
  const userId = sessionStorage.getItem("userid");
  const username = sessionStorage.getItem('username');
  const params = useParams();
  const productid = params.pid;
  const [payment, setPayment] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [record, setRecord] = useState({});

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const url = `http://localhost:9000/fetchbuyaddr1/${productid}`;
    axios.get(url)
      .then((res) => {
        setPayment(res.data);
        setTotalAmount(res.data.productprice); // Initialize total amount with product amount
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [productid]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v2/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  
    script.onload = () => {
      console.log("Razorpay script loaded successfully.");
    };
  
    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
    };
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleQuantityChange = (e) => {
    const enteredQuantity = parseInt(e.target.value, 10);
    if (enteredQuantity > payment.productstock) {
      alert(`Only ${payment.productstock} kg available in stock.`);
      setQuantity(payment.productstock);
      setTotalAmount(payment.productprice * payment.productstock);
    } else {
      setQuantity(enteredQuantity);
      setTotalAmount(payment.productprice * enteredQuantity);
    }
  };

  const newStock = payment.productstock - quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:9000/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productid,
          newStock,
          username,
          quantity,
          prodname:payment.productname,
          amount: totalAmount,
          currency: 'INR',
          image:payment.image,
          receipt: `receipt_${productid}`,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const data = await response.json();
      console.log('Order Data:', data); // Debugging
  
      const options = {
        key: "rzp_test_ZZ7QC9vKOxo773", // Replace with your Razorpay Key ID
        amount: totalAmount * 100, // Ensure amount is in paise
        currency: 'INR',
        name: "Home Decor",
        description: "Online payment",
        image: "/your_logo.png",
        order_id: data.id, // This is the order ID returned by Razorpay
        handler: async function (response) {
          console.log('Payment Response:', response); // Debugging
          alert("Payment successful");
  
          try {
            await axios.post('http://localhost:9000/verifyPayment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productid,newStock
            });
            alert("Payment verification successful.");
            navigate('/userhome')
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: record.customername,
          email: record.deliveryemail,
          contact: record.phonenumber,
        },
        notes: {
          address: record.address,
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error('Razorpay script not loaded.');
      }
    } catch (error) {
      console.error("Error during payment setup:", error);
    }
  };

  return (
      <form method='post' className='form1' onSubmit={handleSubmit}>
      <h1 className="title">Delivery Details Form</h1>
        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input type="text" id="customerName" name="customername" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="cartonNumber">Number of Products</label>
          <input type="number" id="cartonNumber" placeholder={`Available Stock: ${payment.productstock}`}
            value={quantity}
            name="quantity"
            onChange={handleQuantityChange} required  />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input type="tel" id="phoneNumber" name="phonenumber" placeholder="(000) 000-0000" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" placeholder="Street Address" required  onChange={handleChange}/>
          <input type="text" id="addressLine2" name="addressLine2" placeholder="Street Address Line 2" onChange={handleChange} />
          <div className="form-row">
            <input type="text" id="city" name="city" placeholder="City" required onChange={handleChange}/>
            <input type="text" id="state" name="state" placeholder="State / Province" required onChange={handleChange} />
          </div>
          <input type="text" id="postalCode" name="postalCode" placeholder="Postal / Zip Code" required onChange={handleChange}/>
        </div>
        <p>Total Amount: ₹{totalAmount}</p>

        <div className="button-container">
        <button type="submit" className="submit-btn">Proceed to payment</button>
        <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>CANCEL</button>
    </div> </form>
    
  );
}

export default Buyaddress;
