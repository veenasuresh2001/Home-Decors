import React from 'react';
import { Link } from 'react-router-dom';
import search from '../assets/search.png';
import logout from '../assets/logout.png';
import add from '../assets/add.png';

export default function Adminnav() {
    return (
        <div className="navbar">
            <div className="head">
                <h1>DECOR CART</h1>
            </div>
            <ul className="nav-links"> {/* Changed class to className */}
                <li><a href="/adminhome">Home</a></li>
                <li><a href="/adminhome/viewproduct">View Products</a></li>
                <li><a href="/adminhome/report">Report</a></li>
                <li><a href="/adminhome/allorders">View Orders</a></li>
            </ul>
            <div className="icon">
                <button><Link to="/adminhome/addproduct"><img src={add} alt="add" /></Link></button>
                <button><Link to="/"><img src={logout} alt="Logout" /></Link></button>
            </div>
        </div>
    );
}
