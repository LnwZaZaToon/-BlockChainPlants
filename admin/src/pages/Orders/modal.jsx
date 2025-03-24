import React, { useState } from 'react';
import './modal.css';
import { assets, url } from '../../assets/assets';

const Modal = ({ show, onClose, order }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!show) return null;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 5)); // Increase max zoom to 5
    setIsZoomed(true);
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1)); // Keep min zoom at 1
    if (zoomLevel <= 1.25) setIsZoomed(false);
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
  };

  const handleImageClick = () => {
    if (zoomLevel === 1) {
      handleZoomIn();
    } else {
      handleResetZoom();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Amount:</strong> ${order.amount}</p>

        {/* Display the image from the order */}
        {order.image && (
          <div className="order-image-container">
            <div 
              className="order-image-wrapper"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center'
              }}
            >
              <img
                src={url + "/images/" + order.image}
                alt="Order Item"
                onClick={handleImageClick}
              />
            </div>
           { /*<div className="zoom-controls">
              <button onClick={handleZoomIn} disabled={zoomLevel >= 3}>
                <i className="fas fa-search-plus"></i> Zoom In
              </button>
              <button onClick={handleZoomOut} disabled={zoomLevel <= 1}>
                <i className="fas fa-search-minus"></i> Zoom Out
              </button>
              <button onClick={handleResetZoom} disabled={zoomLevel === 1}>
                <i className="fas fa-sync-alt"></i> Reset
              </button>
            </div>*/}
            {isZoomed && (
              <div className="zoom-hint">
                
              </div>
            )}
          </div>
        )}

        <p><strong>Items:</strong></p>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>{item.name} x {item.quantity}</li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;