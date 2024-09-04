import '../components/Styles/navbar.css'
import account from '../assets/user.png'
export default function Navbar(){
    return(
        <div className="navbar">
            <div className="head">
            <h1>DECOR CART</h1>
            </div>
            <ul class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="#">Kitchen & Dining</a></li>
            <li><a href="#">Lighting</a></li>
            <li><a href="#">Wall Decor</a></li>
            <li><a href="#">Bath Decor</a></li>
            <li><a href="#">Furniture</a></li>
        </ul>
        <div className="icon">
        <button><img src={account} alt="Login"/></button>
        <div className="dropdown">
            <a href="/register">Sign Up</a>
            <a href="/userlogin">Sign In</a>
        </div>
        </div>
        </div>
    )
}