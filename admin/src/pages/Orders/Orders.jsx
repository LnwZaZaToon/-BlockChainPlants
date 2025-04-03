import React, { useEffect, useState } from 'react';
import { assets, url } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from './modal';
import './Orders.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [publicKeys, setPublicKeys] = useState({}); // Store public keys by userId
  const [Isverified, setIsverified] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`)
    if (response.data.success) {
      setOrders(response.data.data.reverse());
      console.log(response.data.data);
      fetchPublicKeys(response.data.data); // Fetch public keys after getting orders
    }
    else {
      toast.error("Error fetching orders");
    }
  }

  const fetchPublicKey = async (userId) => {
    console.log(userId)
    try {
      const response = await axios.post(`${url}/api/user/getpublickey?userId=${userId}`);
      console.log(response.data.publicKey)

      if (response.data.publicKey) {
        // Store the public key with the userId as key
        setPublicKeys(prev => ({
          ...prev,
          [userId]: response.data.publicKey
        }));
        return response.data.publicKey;
      }
      return null;
    } catch (err) {
      toast.error("Error fetching public key");
      return null;
    }
  };

  const fetchPublicKeys = async (orders) => {
    // Fetch public keys for each unique userId
    const uniqueUserIds = [...new Set(orders.map(order => order.userId))]; // Get unique userIds
    uniqueUserIds.forEach(async (userId) => {
      if (!publicKeys[userId]) { // Fetch only if we haven't already fetched the public key
        await fetchPublicKey(userId);
      }
    });
  };

  const statusHandler = async (event, orderId) => {
    const order = orders.find(order => order._id === orderId);
    if (!order) {
      toast.error("Order not found");
      return;
    }

    // First fetch the public key for this user
    let publicKey = publicKeys[order.userId];
    if (!publicKey) {
      publicKey = await fetchPublicKey(order.userId);
    }

    if (!publicKey) {
      toast.error("No public key found for this user");
      return;
    }

    // Update the order status
    try {
      const statusResponse = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      });

      if (statusResponse.data.success) {
        await fetchAllOrders();
        setIsverified(true);
        toast.success("Order status updated");
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
      console.error(error);
      return;
    }

    // Perform the blockchain transaction
    try {
      const contractResponse = await axios.post(
        `${url}/api/contract/completeQuest?userAddress=${publicKey}`
      );
      console.log("Transaction response:", contractResponse);
      toast.success('Transaction completed successfully');
      
      // Optional: Handle quest deletion if needed
      /*
      const questId = order.items.find(item => item.category === "quests")?._id;
      if (questId) {
        const deleteResponse = await axios.delete(`${url}/api/order/deleteQuest`, {
          data: { orderId, questId }
        });
        if (deleteResponse.data.success) {
          console.log("Quest deleted successfully from order");
        }
      }
      */
    } catch (error) {
      toast.error("Transaction error");
      console.error("Transaction error:", error);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []); // Fetch all orders when the page loads

  return (
    <div className='order add'>
      <h3>Quest verification </h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-parts'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className='order-item-name'>{"userId: " + order.userId}</p>
              <p className='order-item-name'>{"public key: " + (publicKeys[order.userId] || "Not fetched")}</p>
              <div className='order-item-address'></div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <button 
              className='btnTrans' 
              onClick={(e) => statusHandler(e, order._id)} 
              value={"verified"} 
              disabled={order.status === "verified"}
            >
              {order.status === "verified" ? "Verified" : "Verify"}
            </button>
            <button className='btnOrder' onClick={() => handleOrderClick(order)}>description</button>
          </div>
        ))}
      </div>
      <Modal show={isModalOpen} onClose={closeModal} order={selectedOrder} />
    </div>
  )
}

export default Order;
