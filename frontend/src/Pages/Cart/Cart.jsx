import React, { useContext, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const { cartItems, parts_list, removeFromCart, getTotalCartAmount, url, token ,fetchPartsList} = useContext(StoreContext);
  const navigate = useNavigate();

  const handleRemoveFromCart = async (itemId) => {
    removeFromCart(itemId);

    try {
        // Making the API call to add back an item
        const api = await axios.post(`http://localhost:4000/api/parts/plus?id=${itemId}`);
        console.log(api);

        // Fetch the updated parts list after the item is removed
        fetchPartsList();

        toast.success("Item has been removed from the cart.");
    } catch (error) {
        console.error("Error removing item from cart:", error);
        toast.error("There was an error removing the item from the cart.");
    }
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
    amount: 1,
  };

  try {
    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

    if (response.data.success) {
      // Remove items from the database
      for (const item of orderItems) {
        try {
         
          await axios.post(`${url}/api/parts/remove`, { id: item._id });
          handleRemoveFromCart(item._id)
          console.log(`Removed ${item.name} from the database.`);
          
        } catch (error) {
          console.error(`Error removing item ${item.name}:`, error);
        }
      }
      toast.success("Quest started! Complete it before taking another.");
      navigate('/myorders');
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
                  <p>${item.price }</p>
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
