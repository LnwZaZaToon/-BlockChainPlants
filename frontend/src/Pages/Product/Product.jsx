
import "./Product.css";
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductPage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { token, metaMaskAccount } = useContext(StoreContext);
  const products = [
    {
      id: 1,
      name: "Product 1",
      description: "Description for Product 1",
      image: "test.png",
      value: "100 Points",
    },
    {
      id: 2,
      name: "Product 2",
      description: "Description for Product 2",
      image: "path_to_image_2.jpg",
      value: "150 Points",
    },
    {
      id: 3,
      name: "Product 3",
      description: "Description for Product 3",
      image: "path_to_image_3.jpg",
      value: "200 Points",
    },
    {
      id: 4,
      name: "Product 4",
      description: "Description for Product 4",
      image: "path_to_image_4.jpg",
      value: "250 Points",
    },
  ];

  const handleExchange = (productId) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  return (
    <div className="product-page">
      <h1 className="page-title">Exchange</h1>
      <div className="products-container">
        {products.map((product) => (
          <div className={`product-card ${selectedProducts.includes(product.id) ? 'selected' : ''}`} key={product.id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-value">{product.value}</p>
            <button
              className="exchange-button"
              onClick={() => handleExchange(product.id)}
              disabled = { !token && !metaMaskAccount}
            >

              Exchange
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
