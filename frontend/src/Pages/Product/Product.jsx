import React, { useContext, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';
import { FaLeaf, FaCoins, FaExchangeAlt, FaLock } from 'react-icons/fa';
import axios from 'axios'; 
import { assets } from '../../assets/assets';
import './Product.css';

const ProductPage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { token, metaMaskAccount , Balance ,url} = useContext(StoreContext);
  
  const products = [
    {
      id: 1,
      name: "football jersy 1",
      description: "jersy for the best team",
      image: assets.manu,
      value: 3,
      pointsName: "Green Points"
    },
    {
      id: 2,
      name: "foorball jersy 2",
      description: "jersy for the best team also",
      image: assets.madrid,
      value: 5,
      pointsName: "Green Points"
    },
    {
      id: 3,
      name: "guitar",
      description: "great sound",
      image: assets.guitar,
      value: 2,
      pointsName: "Green Points"
    },
    {
      id: 4,
      name: "wand",
      description: "from harry potter",
      image: assets.wand,
      value: 4,
      pointsName: "Green Points"
    },
  ];

  const handleExchange = async (productId) => {
    if (!token || !metaMaskAccount) {
      toast.error("Please connect your wallet and sign in to exchange products");
      return;
    }

    const product = products.find(p => p.id === productId);
    
    try {
      const response = await axios.post(`${url}/api/contract/postBuyproduct?userAddress=${metaMaskAccount}&coin=${product.value}`);
      console.log(response)
      toast.success(`Successfully exchanged ${product.value} ${product.pointsName} for ${product.name}!`);
      setSelectedProducts([]);
    } catch (error) {
      toast.error("Exchange failed. Please try again.");
      console.error("Exchange error:", error);
    }
};


  return (
    <div className="product-exchange-page">
      <div className="exchange-header">
        <h1 className="page-title">
          <FaExchangeAlt className="title-icon" /> Green Rewards Exchange
        </h1>
        <p className="page-subtitle">
          Redeem your <FaCoins className="points-icon" /> {products[0]?.pointsName} for sustainable gardening products
        </p>
      </div>

      <div className="wallet-status">
        {metaMaskAccount ? (
          <div className="wallet-connected">
            <span className="wallet-icon">🟢</span>
            Wallet Connected: {metaMaskAccount.slice(0, 6)}...{metaMaskAccount.slice(-4)}
          </div>
        ) : (
          <div className="wallet-disconnected">
            <span className="wallet-icon">🔴</span>
            Wallet Not Connected
          </div>
        )}
        {token ? (
          <div className="points-balance">
            <FaCoins className="points-icon" /> {Balance || 0} {products[0]?.pointsName} Available
          </div>
        ) : (
          <div className="login-required">
            <FaLock className="lock-icon" /> Sign in to view your balance
          </div>
        )}
      </div>

      <div className="products-container">
        {products.map((product) => (
          <div 
            className={`product-card ${selectedProducts.includes(product.id) ? 'selected' : ''}`} 
            key={product.id}
            onClick={() => setSelectedProducts([product.id])}
          >
            <div className="product-image-container">
              <img 
                src={`${product.image}`} 
                alt={product.name} 
                className="product-image" 
                onError={(e) => {
                  e.target.src = '/images/products/placeholder.jpg';
                }}
              />
              <div className="product-value-badge">
                <FaCoins className="coin-icon" /> {product.value} {product.pointsName}
              </div>
            </div>
            
            <div className="product-info">
              <h2 className="product-name">
                <FaLeaf className="product-icon" /> {product.name}
              </h2>
              <p className="product-description">{product.description}</p>
              
              <button
                className={`exchange-button ${selectedProducts.includes(product.id) ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExchange(product.id);
                }}
                disabled={!token || !metaMaskAccount}
              >
                {selectedProducts.includes(product.id) ? 'Confirm Exchange' : 'Select to Exchange'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="exchange-info">
        <h3>How It Works</h3>
        <ol>
          <li>Connect your wallet and sign in to your account</li>
          <li>Browse available eco-friendly products</li>
          <li>Select items to exchange with your Green Points</li>
          <li>Confirm your selection and receive your rewards</li>
        </ol>
      </div>
    </div>
  );
};

export default ProductPage;