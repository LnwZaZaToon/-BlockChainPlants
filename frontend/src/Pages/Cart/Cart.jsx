import React, { useContext, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const { cartItems, parts_list, removeFromCart, getTotalCartAmount, url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    toast.success("Item has been removed from the cart.");
  };

  const placeOrder = async () => {
    if (!token) {
        toast.error("Please sign in to start a quest.");
        navigate('/cart');
        return;
    }
    
    if (getTotalCartAmount() === 0) {
        toast.error("Your quest bag is empty.");
        navigate('/cart');
        return;
    }

    let orderItems = parts_list.map((item) => {
        if (cartItems[item._id] > 0) {
            return { ...item, quantity: cartItems[item._id] };
        }
        return null;
    }).filter(Boolean);

    let orderData = {
        userId: token, // Assuming token contains user ID
        items: orderItems,
        amount: getTotalCartAmount() + 0.75,
    };

    try {
        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

        if (response.data.success) {
            toast.success("Quest started! Complete it before taking another.");
            window.location.replace(response.data.session_url);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error("Failed to start quest. Try again.");
        console.error("Order Error:", error);
    }
};


  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {parts_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <div>{cartItems[item._id]}</div>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p className='cart-items-remove-icon' onClick={() => handleRemoveFromCart(item._id)}>x</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Your Quest's ready to go</h2>
          <button onClick={placeOrder}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
