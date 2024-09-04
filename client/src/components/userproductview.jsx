import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/Styles/Productview.css';
import { useNavigate } from 'react-router-dom';

export default function UserproductView() {
    const userid = sessionStorage.getItem('userid');
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const nav = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:9000/productview')
            .then(response => {
                if (response.data.message) {
                    setProducts([]);
                } else {
                    const filteredProducts = response.data.filter(product => product.productstock > 0);
                    setProducts(filteredProducts);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
            });
    }, []);

    // Buy now action
    const buynow = (item) => {
        nav(`/userhome/buyaddress/${item}`);
    };

    // Add to cart action
    const addCart = async (pid) => {
        try {
            const response = await axios.post(`http://localhost:9000/addtocart/${pid}/${userid}`);
            alert(response.data.message || "Item added to cart successfully");
        } catch (err) {
            if (err.response && err.response.status === 400) {
                alert(err.response.data.error || "Item is already in the cart");
            } else {
                console.error("Error adding to cart:", err);
                alert("Error adding item to cart");
            }
        }
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.productname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                   
            <h1>Product List</h1>
            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product._id} className="product-card">
                            <img 
                                src={`http://localhost:9000/uploads/${product.image}`} 
                                alt={product.productname} 
                                className="product-image" 
                            />
                            <h2>{product.productname}</h2>
                            <p>Type: {product.producttype}</p>
                            <p>Price: ${product.productprice}</p>
                            <p>{product.description}</p>
                            <button className='buynow' onClick={() => buynow(product._id)}>Buy Now</button>
                            <button className='cart' onClick={() => addCart(product._id)}>Add to cart</button>
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
}
