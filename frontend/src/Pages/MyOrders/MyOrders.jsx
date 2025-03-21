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

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          data.map((order, index) => (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="Parcel" />
              <p>
                {order.items?.map(item => `${item.name} x ${item.quantity}`).join(", ")}
              </p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items?.length || 0}</p>
              <p>
                <span>&#x25cf;</span> 
                <b>
                  {order.status === "pending" ? "Waiting for Admin Verification" : order.status}
                </b>
              </p>
              <button>Track Order</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
