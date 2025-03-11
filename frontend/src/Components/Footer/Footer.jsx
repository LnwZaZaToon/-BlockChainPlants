import React from 'react';
import whatsapp_icon from '../../assets/whatsapp_icon.png';
import pintrest_icon from '../../assets/pintester_icon.png';
import instagram_icon from '../../assets/instagram_icon.png';

import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icons">
        <div className="footer-icons-container">
            <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={pintrest_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={whatsapp_icon} alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>&copy; 2024 AutoParts Store. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer