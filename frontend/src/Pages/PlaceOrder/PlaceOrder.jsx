import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './PlaceOrder.css';

const PlaceOrder = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        image: null
    });

    const [status, setStatus] = useState("Pending"); // Default to Pending
    const { token, parts_list, cartItems, url, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Sign in first to submit an order.");
            navigate('/cart');
        }
    }, [token]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = (event) => {
        setData(prevData => ({ ...prevData, image: event.target.files[0] }));
    };

    const submitOrder = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("image", data.image);
        formData.append("items", JSON.stringify(cartItems)); // Convert items to JSON
        formData.append("status", "Pending"); // Default status

        try {
            const response = await axios.post(url + "/api/order/submit", formData, {
                headers: { token, "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                toast.success("Order submitted! Waiting for admin approval.");
                setStatus("Pending");
            }
        } catch (error) {
            toast.error("Failed to submit order.");
            console.error(error);
        }
    };

    return (
        <form onSubmit={submitOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Order Submission</p>
                <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email' required />
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
                <input type="file" accept="image/*" onChange={handleImageUpload} required />

                <button className='place-order-submit' type='submit'>Submit for Approval</button>
            </div>

            <div className="place-order-right">
                <h2>Order Status</h2>
                <p className={`status ${status.toLowerCase()}`}>{status}</p>
            </div>
        </form>
    );
}

export default PlaceOrder;
