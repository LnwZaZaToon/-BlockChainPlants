import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';

import './MyOrders.css';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Handle Image Upload
  const handleImageUpload = async (event, orderId) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("orderId", orderId);

    try {
      const response = await axios.post(url + "/api/order/addimages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token
        }
      });

      if (response.data.success) {
        alert("Image uploaded successfully!");
        fetchOrders(); // Refresh orders after upload
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  return (
    <div className='my-orders'>
      <h2>Your Quest</h2>
      <div className="container">
        {data.length === 0 ? (
          <div className='no-orders'>
            <span className="plant-icon">🌱</span>
            <span className="leaf-decoration">🍃</span>
            <span className="leaf-decoration">🌿</span>
            <p>Your Quest is empty</p>
          </div>
        ) : (
          data.reverse().map((order, index) => (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="Parcel" />
              <p>
                {order.items?.map(item => `${item.name} x ${item.quantity}`).join(", ")}
              </p>
              <p> {order.amount}.00 carbon credit</p>
              <p>Items: {order.items?.length || 0}</p>
              <p>
                <span>&#x25cf;</span>
                <b>
                  {order.status === "pending" ? "Waiting for Admin Verification" : order.status}
                </b>
              </p>

              {/* Hidden file input for image upload */}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id={`upload-${order._id}`}
                onChange={(event) => handleImageUpload(event, order._id)}
              />

              {/* Button to trigger file selection */}
              <button onClick={() => document.getElementById(`upload-${order._id}`).click()}>
                Upload Image
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
