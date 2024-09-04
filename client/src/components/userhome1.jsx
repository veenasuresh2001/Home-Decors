import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../components/Styles/userdesign.css'
export default function Userdesign(){
    const userid = sessionStorage.getItem('userid');
    const username = sessionStorage.getItem('username'); 
    const navigate = useNavigate();    
    const handleShopClick = () => {
        document.getElementById('explore').style.display = 'none'; 
        navigate('/userhome/userview'); // Navigate to the UserproductView component
    };
    return(
        <>
        <div className="main">
            <h2>Welcome {username}</h2>
        </div>
        <div className="main2">
            <button id="explore" onClick={handleShopClick}>Explore</button>
        </div>
        </>
        
    )
}