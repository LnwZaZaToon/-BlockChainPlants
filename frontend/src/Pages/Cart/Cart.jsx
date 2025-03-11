import React, { useContext, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './Cart.css';

const Cart = () => {
  const { cartItems, parts_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [isPromoCodeValid, setIsPromoCodeValid] = useState(true);
  const [discountApplied, setDiscountApplied] = useState(false);

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    toast.success("Item has been removed from the cart."); // Display success message when item is removed
  };

  const applyPromoCode = () => {
    if (promoCode === 'SathiTInwza007soCuTe') {
      setIsPromoCodeValid(true);
      setDiscountApplied(true);
      updatePromoCodeValidity(true);
      toast.success("Promo code applied successfully! You get a 99% discount.");
      
    } else {
      setIsPromoCodeValid(false);
      setDiscountApplied(false);
      updatePromoCodeValidity(false);
      toast.error("Invalid promo code. Please try again.");
    }
  };

  const discountedTotal = () => {
    const totalAmount = getTotalCartAmount() + 0.75;
    if (discountApplied) {
      toast.success("Promo code applied successfully! You get a 99% discount.");
      return totalAmount * 0.01;
    } else {
      return totalAmount;
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
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>${getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>${getTotalCartAmount() === 0 ? 0 : 1.75}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>${discountedTotal()}</b></div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo code' value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <button onClick={applyPromoCode}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
