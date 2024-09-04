import React from 'react';
import '../components/Styles/userhome.css';
import Slider from './slider';
import Usernav from "./usernav";
import { Route, Routes, useNavigate } from "react-router-dom";
import UserproductView from './userproductview';
import Buyaddress from './buyaddress';
import Myorders from './myorders';
import Cart from './cart';
import { useEffect } from 'react';
import Cartaddress from './cartaddress';
import Userdesign from './userhome1';



export default function Userhome() {
    const userid = sessionStorage.getItem('userid');
    const username = sessionStorage.getItem('username');
    return (
        <>
            <Usernav />           
            <Routes>
                <Route path='/' element={<Userdesign/>}></Route>
                <Route path='/userview' element={<UserproductView />} />
                <Route path='/buyaddress/:pid' element={<Buyaddress/>} />
                <Route path='/myorders' element={<Myorders/>} />
                <Route path='/cart' element={<Cart/>} />
                <Route path='/cartform' element={<Cartaddress/>} />
                
            </Routes>
        </>
    );
}
