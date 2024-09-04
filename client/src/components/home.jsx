import React from 'react';
import img1 from '../assets/homedeco.avif';
import '../components/Styles/home.css'
import Navbar from '../components/navbar'

export default function Homepage() {
    return (
        <>
        <Navbar />
        <div className="home" style={{ backgroundImage: `url(${img1})` }}>
            <h1>HOME DECORATION</h1>
            <p>The best home decoration store</p>
        </div>
        </>
    );
}
