import React from 'react';
import { Link } from 'react-router-dom';
import cart from '../assets/grocery-store.png'
import search from '../assets/search.png'
import logout from '../assets/logout.png'

export default function Usernav(){
    return(
        <div className="navbar">
            <div className="head">
                <h1>DECOR CART</h1>
            </div>
            <ul className="nav-links">
                <li><a href="/userhome">Home</a></li>
                <li><a href="/userhome/userview">View Products</a></li>
                <li><a href="/userhome/myorders">My Orders</a></li>
                
            </ul>
            <div className="icon">
                <button><Link to="/userhome/cart"><img src={cart} alt="Cart"/></Link></button>
                <button><Link to="/"><img src={logout} alt="Logout" /></Link></button>
            </div>
        </div>
    )
}
