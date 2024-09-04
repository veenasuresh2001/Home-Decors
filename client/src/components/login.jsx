import '../components/Styles/login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './navbar';

import axios from 'axios'

export default function Loginpage() {
    
    const navigate=useNavigate();
    const [login, setLogin] = useState({email:'',password:''});
    const handlechange=(e)=>{
        setLogin({...login,[e.target.name]:e.target.value})
    }
    const handlesubmit=(e)=>{
        e.preventDefault()
        if(login.email=='admin@gmail.com'){
            if(login.password=='admin123'){
               
                navigate('/adminhome')
            }
        }
        const url='http://localhost:9000/login'
        axios.post(url,login)
        .then((res)=>{
            const response=res.data
            if(response.status==1){
                sessionStorage.setItem('userid',response.userid);
                sessionStorage.setItem('username',response.username);
                sessionStorage.setItem('lastname',response.lastname);
                sessionStorage.setItem('email',response.email);
                toast.success(response.msg)
               
                navigate('/userhome')
            }
            else{
                toast.error(response.msg)
            }
        })

    }
    return (
        <>
        <Navbar/>
        <div className="loginpage">
        <form method='post' onSubmit={handlesubmit}>
            <h1>Login</h1>
                <input type="email" name='email' onChange={handlechange} placeholder="Email" required />
                <input type="password" name='password'onChange={handlechange} placeholder="Password" required />
                <button type='submit'>Login</button>
                <p id="ptag">New customer? <a href="/register">Create an account</a></p>
            </form>
            <ToastContainer/>
        </div>
        
        </>
    );
}
