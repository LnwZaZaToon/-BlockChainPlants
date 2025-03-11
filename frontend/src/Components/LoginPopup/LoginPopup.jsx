import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../../Context/StoreContext';
import { FaUserShield } from 'react-icons/fa';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { BsFillShieldLockFill } from 'react-icons/bs';

import video from '../../assets/video.mp4';
import logo from '../../assets/logo.png';
import axios from 'axios';

import './LoginPopup.css';
import '../../App.css';

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, url, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState('Login');
  const [isChecked, setIsChecked] = useState(false);

  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const onLogin = async (e) => {
    e.preventDefault();

    if (currState === 'Login' && !isChecked) {
        toast.error("Please agree to the terms of use & privacy policy.");
        return;
      }
    
      let new_url = url;
      if (currState === 'Login') {
        new_url += '/api/user/login';
      } else {
        new_url += '/api/user/register';
      }
      const response = await axios.post(new_url, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        loadCartData({ token: response.data.token });
        setShowLogin(false);
        if (currState === 'Login') {
            toast.success('Login successful!');
        } else {
            toast.success('Registration successful!');
        }
      } else {
        toast.error(response.data.message);
      }
    };

  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h2 className="title">Create And Sell Extraordinary Product</h2>
            <p>Adopt the pace of nature!</p>
          </div>

          <div className="footerDiv flex">
            <span className="text">
              {currState === 'Login' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button className="btn" onClick={() => setCurrState(currState === 'Login' ? 'Sign Up' : 'Login')}>
              {currState === 'Login' ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="" />
            <h3>{currState === 'Login' ? 'Welcome Back!' : 'Create an Account'}</h3>
          </div>

          <form onSubmit={onLogin} className="form grid">
            {currState === 'Sign Up' && (
              <div className="inputDiv">
                <label htmlFor="name">Username</label>
                <div className="input flex">
                  <FaUserShield className="icon" />
                  <input type="text" id="name" name="name" placeholder="Enter Name" value={data.name} onChange={onChangeHandler} />
                </div>
              </div>
            )}

            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <FaUserShield className="icon" />
                <input type="email" id="email" name="email" placeholder="Enter Email" value={data.email} onChange={onChangeHandler} />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <BsFillShieldLockFill className="icon" />
                <input type="password" id="password" name="password" placeholder="Enter Password" value={data.password} onChange={onChangeHandler} />
              </div>
            </div>

            {currState === 'Login' && (
              <div className='loginsignup-agree'>
                <input type='checkbox' id='terms' checked={isChecked} onChange={handleCheckboxChange} />
                <label htmlFor='terms'>I agree to the terms of use & privacy policy.</label>
              </div>
            )}

            <button type='submit' className='btn flex'>
              <span>{currState === 'Login' ? 'Login' : 'Sign Up'}</span>
              <AiOutlineSwapRight className='icon' />
            </button>

            {currState === 'Login' && (
              <span className='forgotPassword'>
                Forgot your password? <Link to='/forgot-password'>Click Here</Link>
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
