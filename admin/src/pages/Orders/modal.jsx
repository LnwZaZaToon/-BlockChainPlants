// Modal.js
import React from 'react';
import './modal.css';
import { assets, url } from '../../assets/assets';

const Modal = ({ show, onClose, order }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Amount:</strong> ${order.amount}</p>
        
        {/* Display the image from the order */}
        {order.image && (
          <div className="order-image">
            <img src={url + "/images/" + order.image} alt="Order Item" style={{ width: '70%', height: 'auto%',alignItems:'center' }} />
          </div>
        )}
        
        <p><strong>Items:</strong></p>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>{item.name} x {item.quantity}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
