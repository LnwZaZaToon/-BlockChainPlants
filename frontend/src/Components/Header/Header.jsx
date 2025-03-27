import React, { useState } from 'react';
import hero_image from "../../assets/hero_image.png";
import { FaLeaf, FaSeedling, FaTree, FaWater } from 'react-icons/fa';
import './Header.css';
import { assets } from '../../assets/assets';

const Header = ({ name }) => {
    const [showDescription, setShowDescription] = useState(false);

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    return (
        <div className="hero">
            <div className="hero-left">
                <h2>Discover Quests</h2>
                <h3>Welcome Back</h3>
                <div className="hero-hand-icon">
                    <p>{name}</p>
                </div>
                <p>Want to know us more?</p>
                <button className="hero-latest-btn" onClick={toggleDescription}>
                    Description
                </button>
            </div>
            <div className="hero-right">
                <img src={assets.plant2} alt="hero" />
            </div>

            {/* Description Popup */}
            {showDescription && (
                <div className="description-popup" onClick={toggleDescription}>
                    <div className="popup-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={toggleDescription}>×</button>
                        <h2><FaLeaf /> Why We Plant <FaLeaf /></h2>

                        <div className="story-section">
                        <div className="story-point">
                                <div className="story-icon-container">
                                    <FaSeedling className="story-icon" />
                                    <img src= {assets.carbon} alt="Ecosystem restoration" className="story-image" />
                                </div>
                                <h3>Reduce carbon</h3>
                                <p>Tree planting is a key strategy for carbon offsetting, helping to balance out carbon emissions from other sources. As the trees grow and absorb atmospheric carbon dioxide, they lock the carbon in the wood of their trunks in the form of carbohydrates until the tree dies, decays, or is burnt.</p>
                            </div>

                            <div className="story-point">
                                <div className="story-icon-container">
                                    <FaTree className="story-icon" />
                                    <img src= {assets.plantt} alt="Ecosystem restoration" className="story-image" />
                                </div>
                                <h3>Restoring Ecosystems</h3>
                                <p>Plants are the foundation of all ecosystems. By planting native species, we rebuild habitats for wildlife and restore natural biodiversity.</p>
                            </div>

         
                        </div>

                        <div className="call-to-action">
                            <p>Join our community of planters and be part of the solution!</p>
                      
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;