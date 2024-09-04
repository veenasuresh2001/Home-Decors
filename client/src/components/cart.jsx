import React, { useState, useEffect } from 'react';
import AXIOS from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/Styles/cart.css'
import { useNavigate } from 'react-router-dom';

function Cart() {
  const userId = sessionStorage.getItem("userid");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `http://localhost:9000/cart/${userId}`;
    AXIOS.get(url)
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
      });
  }, []);

  const handleSelectProduct = (productId) => {
    setSelectedProduct(productId);
    setQuantity(1); // Reset quantity when selecting a new product
  };

  const handleQuantityChange = (value) => {
    if (isNaN(value)) {
      return; 
    }

    const product = cart.find(item => item._id === selectedProduct);
    if (product) {
      const maxQuantity = parseInt(product.prodquantity, 10);
      const inputQuantity = parseInt(value, 10);

      if (inputQuantity > maxQuantity) {
        toast.warn(`You cannot select more than ${maxQuantity} of this product.`);
        setQuantity(maxQuantity);
      } else if (inputQuantity < 1) {
        setQuantity(1); // Minimum quantity is 1
      } else {
        setQuantity(inputQuantity);
      }
    }
  };

  const handleDeleteProduct = (productId) => {
    const confirmDelete = window.confirm("Do you want to delete this product from the cart?");
    if (confirmDelete) {
      const url = `http://localhost:9000/deletecart/${productId}`;
      AXIOS.delete(url)
        .then((res) => {
          setCart(cart.filter(item => item._id !== productId));
          toast.success(res.data);
        })
        .catch((err) => {
          console.error("Error deleting product:", err);
        });
    } else {
      toast.error("DELETION CANCELLED");
    }
  };

  const handleCheckout = () => {
    if (selectedProduct) {
      const productToBuy = cart.find(item => item._id === selectedProduct);
      if (productToBuy) {
        const totalAmountInRupees = productToBuy.prodamount * quantity;
        navigate('/userhome/cartform', {
          state: {
            productId: selectedProduct,
            quantity,
            oldqty: productToBuy.prodquantity,
            totalPrice: totalAmountInRupees,
          prodnamee: productToBuy.prodname
          }
        });
      } else {
        toast.error("Selected product is not available");
      }
    } else {
      toast.warn("Please select a product to proceed to checkout.");
    }
  };
  
  const totalSelectedPrice = selectedProduct ? 
    (cart.find(item => item._id === selectedProduct)?.prodamount || 0) * quantity : 0;

  return (
    <div className="cart-container">
      <div className="cart-items">
        {cart.map((item, index) => (
          <div className="cart-item" key={index}>
            <label htmlFor="">Select Here</label>
            <input
              type="radio"
              checked={selectedProduct === item._id}
              onChange={() => handleSelectProduct(item._id)}
            />
            <div className="cart-item-image">
              <img src={`http://localhost:9000/uploads/${item.image}`} alt={item.prodname} />
            </div>
            <div className="cart-item-details">
              <h3>{item.prodname}</h3>
              <p>{item.proddesc}</p>
              {selectedProduct === item._id && (
                <div className="cart-item-quantity">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={cart.find(item => item._id === selectedProduct)?.prodquantity || 1}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                  />
                  <p>Available stock: {item.prodquantity} kg</p>
                </div>
              )}
            </div>
            <div className="cart-item-price">
              <p>${item.prodamount}</p>
              <button onClick={() => handleDeleteProduct(item._id)}>X</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>CART</h3>
        <p>Your Ordered Products: {selectedProduct ? cart.find(item => item._id === selectedProduct)?.prodname || 'None' : 'None'}</p>
        <p>Total Price To Be Paid: ${totalSelectedPrice}</p>
        <button onClick={handleCheckout} disabled={!selectedProduct}>Checkout</button>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Cart;
