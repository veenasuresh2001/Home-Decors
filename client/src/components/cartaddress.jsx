import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './cartaddress.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Cartaddress() {
    const location = useLocation();
    const { productId, quantity: initialQuantity, totalPrice, oldqty, prodnamee } = location.state || {};
    const username = sessionStorage.getItem('username');
    const userId = sessionStorage.getItem("userid");
    const [productDetails, setProductDetails] = useState({});
    const [formValues, setFormValues] = useState({});
    const [quantity, setQuantity] = useState(initialQuantity); // Track quantity in state
    const [totalAmount, setTotalAmount] = useState(totalPrice);
    const [id, setId] = useState(0); // Initialize id state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/fetchbuyaddr/${productId}`);
                const productData = response.data;
                console.log("Fetched product details:", productData);
                setProductDetails(productData);
                setId(productData.productId); // Set id directly after fetching product details
                setTotalAmount(productData.prodamount * initialQuantity); // Update total amount
            } catch (error) {
                console.error("Error fetching product details:", error);
                toast.error("Failed to fetch product details."); // Add toast error message
            }
        };

        fetchProductDetails();
    }, [productId, initialQuantity]);

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
            toast.error("Failed to load payment script."); // Add toast error message
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleQuantityChange = (e) => {
        const enteredQuantity = parseInt(e.target.value, 10);
        const availableQuantity = productDetails.prodquantity;

        if (enteredQuantity > availableQuantity) {
            toast.error(`Only ${availableQuantity} kg available in stock.`);
            setQuantity(availableQuantity);
            setTotalAmount(productDetails.prodamount * availableQuantity);
        } else {
            setQuantity(enteredQuantity);
            setTotalAmount(productDetails.prodamount * enteredQuantity);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newQuantity = oldqty - quantity;
            const { data } = await axios.post('http://localhost:9000/createcartOrder', {
                userId,
                username,
                quantity,
                newquantity: newQuantity,
                idd: id, // Use id from state
                amount: totalAmount,
                prodname: prodnamee,
                currency: 'INR',
                receipt: `receipt_${productId}`,
                notes: {
                    address: formValues.deliveryaddress,
                },
            });

            const options = {
                key: "rzp_test_ZZ7QC9vKOxo773",
                amount: data.amount,
                currency: data.currency,
                name: "Home Decor",
                description: "Order Payment",
                image: "/your_logo.png",
                order_id: data.id,
                handler: async function (response) {
                    toast.success("Payment successful");
                    try {
                        await axios.post('http://localhost:9000/verifyPayment1', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            idd: id, 
                            productId,
                            newquantity: newQuantity
                        });
                        toast.success("Payment verification successful");
                        navigate('/userhome')
                    } catch (error) {
                        console.error("Error verifying payment:", error);
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: formValues.deliveryname,
                    email: formValues.deliveryemail,
                    contact: formValues.deliverynumber,
                },
                notes: {
                    address: formValues.deliveryaddress,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Error during payment setup:", error);
            toast.error("Error during payment setup.");
        }
    };

    return (
        <div className="container">
            <h1 className="title">Delivery Details Form</h1>

            <form method='post' onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Customer Name</label>
                    <input type="text" id="customerName" name="customername" required onChange={handleChange} />
                </div>

                <div className="form-group">
                    <input type="number" id="cartonNumber" hidden placeholder={`Available Stock: ${productDetails.productstock} kg`}
                        value={quantity}
                        name="quantity"
                        onChange={handleQuantityChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phonenumber" placeholder="(000) 000-0000" required onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" placeholder="Street Address" required onChange={handleChange} />
                    <input type="text" id="addressLine2" name="addressLine2" placeholder="Street Address Line 2" onChange={handleChange} />
                    <div className="form-row">
                        <input type="text" id="city" name="city" placeholder="City" required onChange={handleChange} />
                        <input type="text" id="state" name="state" placeholder="State / Province" required onChange={handleChange} />
                    </div>
                    <input type="text" id="postalCode" name="postalCode" placeholder="Postal / Zip Code" required onChange={handleChange} />
                </div>
                <p>Total Amount: ₹{totalAmount}</p>

                <button type="submit" className="submit-btn">Proceed to payment</button>
                <button type="button" className="submit-btn" onClick={() => navigate(-1)}>CANCEL</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Cartaddress;
