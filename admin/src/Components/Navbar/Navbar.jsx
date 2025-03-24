import { assets } from '../../assets/assets';
import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="Company Logo" />
      
      <div className="navbar-profile-container" onClick={() => setShowDropdown(!showDropdown)}>
        <span className="navbar-admin-badge">Admin</span>
        <img 
          className='profile' 
          src={assets.profile_image} 
          alt="Admin Profile" 
        />
        
        {/* Admin Dropdown Menu */}
        <ul className={`navbar-profile-dropdown ${showDropdown ? 'show' : ''}`}>
          <li>
            <img src={assets.dashboard_icon} alt="" />
            <p>Dashboard</p>
          </li>
          <li>
            <img src={assets.orders_icon} alt="" />
            <p>Manage Orders</p>
          </li>
          <li>
            <img src={assets.products_icon} alt="" />
            <p>Manage Products</p>
          </li>
          <hr />
          <li>
            <img src={assets.logout_icon} alt="" />
            <p>Logout</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar;