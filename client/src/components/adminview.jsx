import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function ProductView() {
    const [products, setProducts] = useState([]);
    const navigate=useNavigate();
    useEffect(() => {
        axios.get('http://localhost:9000/productview')
            .then(response => {
                if (response.data.message) {
                    setProducts([]);
                } else {
                    setProducts(response.data);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
            });
    }, []);

    const deleteProduct = (pid) => {
        const confirmDelete = window.confirm("Do you want to delete this product?");
        if (confirmDelete) {
          const url = `http://localhost:9000/deleteproduct/${pid}`;
          axios.delete(url)
            .then((res) => {
             
              alert(res.data);
            })
            .catch((err) => {
              console.error("Error deleting product:", err);
            });
        } else {
          alert("DELETION CANCELLED");
        }
      };


      const editproduct=(taskid)=>{
        navigate(`/adminhome/edittask/${taskid}`)
      }
    
    return (
        <div>
            <h1>Product List</h1>
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product._id} className="product-card">
                            <img 
                                src={`http://localhost:9000/uploads/${product.image}`} 
                                alt={product.productname} 
                                className="product-image" 
                            />
                            <h2>{product.productname}</h2>
                            <p>Type: {product.producttype}</p>
                            <p>Price: ${product.productprice}</p>
                            <p>Stock: {product.productstock}</p>
                            <button className='deletebutton' onClick={() => deleteProduct(product._id)}>DELETE</button>
                            <button className='editbutton' onClick={() => editproduct(product._id)}>EDIT</button>
                        </div>
                    ))
                ) : (   
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
}
