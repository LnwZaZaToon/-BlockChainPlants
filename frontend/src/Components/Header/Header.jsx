import React from 'react';
import hero_image from "../../assets/hero_image.png";

import './Header.css';

const Header = ({ name }) => {
    return (
        <div className="hero">
          <div className="hero-left">
            <h2>NEW ARRIVALS ONLY</h2>
            <h3>WELCOME BACK</h3>
            <div>
              <div className="hero-hand-icon">
                <p>{name}</p>
                
              </div>
              <p>{}</p>
            </div>
          </div>
          <div className="hero-right">
            <img src={hero_image} alt="hero" />
          </div>
        </div>
      );
    };
    

export default Header
