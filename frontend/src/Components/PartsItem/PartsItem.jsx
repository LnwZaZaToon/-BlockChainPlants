import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

import './PartsItem.css';

const PartsItem = ({ image, name, price, amount, desc, id }) => {
    const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    useEffect(() => {
        // Update itemCount when cartItems change
        if (cartItems[id]) {
            setItemCount(cartItems[id]);
        } else {
            setItemCount(0);
        }
    }, [cartItems, id]);

    const handleAddToCart = (itemId) => {
        if (amount > itemCount) {
            addToCart(itemId);
            setItemCount(itemCount + 1);
            toast.success("An item has been added to the cart.");
        } else {
            toast.error("This item is out of stock.");
        }
    };

    const handleRemoveFromCart = (itemId) => {
        removeFromCart(itemId);
        setItemCount(itemCount - 1); // Decrement itemCount when an item is removed from the cart
    };

    return (
        <div className='parts-item'>
            <div className='parts-item-img-container'>
                <img className='parts-item-image' src={url + "/images/" + image} alt="" />
                {!cartItems[id]
                    ? <img className='add' onClick={() => handleAddToCart(id)} src={assets.add_icon_white} alt="" />
                    : <div className="parts-item-counter">
                        <img src={assets.remove_icon_red} onClick={() => handleRemoveFromCart(id)} alt="" />
                        <p>{cartItems[id]}</p>
                        <img src={assets.add_icon_green} onClick={() => handleAddToCart(id)} alt="" />
                    </div>
                }
            </div>
            <div className="parts-item-info">
                <div className="parts-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="" />
                </div>
                <p className="parts-item-desc">{desc}</p>
                <p className="parts-item-price">${price}</p>
                <p className="parts-item-amount">{amount - itemCount}</p>
            </div>
        </div>
    );
};

export default PartsItem;
