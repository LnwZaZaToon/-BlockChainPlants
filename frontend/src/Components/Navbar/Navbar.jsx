import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

import './Navbar.css';

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token ,setToken,metaMaskAccount, connectMetaMask,Balance} = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("metaMaskAccount");
    setToken("");
    navigate('/');
    toast.success("Logout complete");
  }
  const handleNavigation = (path,path2) => {
    setShowLogin(false);
    setMenu(path2);
    navigate(path);  
  }
  

   return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => handleNavigation("/","home")  } className={`${menu === "home" ? "active" : ""}`}>Home</Link>
        <Link to="/quests" onClick={() => handleNavigation("/quests","quests") } className={`${menu === "quests" ? "active" : ""}`}>Quests</Link>
        <Link to="/product" onClick={() => handleNavigation("/product","product") } className={`${menu === "product" ? "active" : ""}`}>product</Link>
      </ul>
      <div className="navbar-right">
        <div className="metamask-container">
          {metaMaskAccount ? (
            <div className="metamask-connected">
              <p className="metamask-account">Connected: {metaMaskAccount.slice(0, 6)}...{metaMaskAccount.slice(-4)}</p>
              <p className="metamask-balance">Balance: {Balance} carbon credit</p>
            </div>
          ) : (
            <button className="metamask-button" onClick={connectMetaMask}>
              {/*<img src={assets.metamask_icon} alt="MetaMask" className="metamask-icon" />*/}
              Connect Wallet
            </button>
          )}
        </div>
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={() => navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Quest list</p></li>
              <hr />
              <li onClick={() => navigate('/history')}> <img src={assets.bag_icon} alt="" /> <p>History</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li>
            </ul>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar;
