import '../components/Styles/register.css';
import { useState, useContext } from 'react';
import Navbar from './navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authen from '../../context/authen';

export default function Registration() {
  const login = useContext(authen);
  const nav = useNavigate();
  const [user, setUser] = useState({});

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const url = 'http://localhost:9000/register';

    axios.post(url, user)
      .then((res) => {
        if (res.data === "Registered!") {
          toast.success(res.data);
        } else {
          toast.error(res.data);
        }
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="registration-container">
        <div className="registration-form">
          <h1>Register</h1>
          <p className="registration-subtitle">Please fill the form below:</p>
          <form onSubmit={handlesubmit}>
            <input type="text" name='firstname' placeholder="First Name" onChange={handleChange} required />
            <input type="text" name='lastname' placeholder="Last Name" onChange={handleChange} required />
            <input type="email" name='email' placeholder="Email" onChange={handleChange} required />
            <input type="password" name='password' placeholder="Password" onChange={handleChange} required />
            <input type="password" name='confirm' placeholder="Confirm Password" onChange={handleChange} required />
            <button type="submit" className="register-button">Register</button>
          </form>
          <p className="login-prompt">Already have an account? <a href="/userlogin">Login</a></p>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
