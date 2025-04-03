import React, { useEffect, useState } from 'react';
import { assets, url } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from './modal';

import './Orders.css';

const Order = () => {

  const [orders, setOrders] = useState([]);
  const [publicKey, setPublicKey] = useState(null);
  const [Isverified, setIsverified] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to track the selected order
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`)
    if (response.data.success) {
      setOrders(response.data.data.reverse());
      console.log(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }
  const fetchPublicKey = async () => {
    try {
      let Data = {
        userId: orders.userId
      }
      const response = await axios.post(`${url}/api/user/getpublickey`, Data);
      console.log(response);
      setPublicKey(response.data.metaMaskAccount);
    } catch (err) {
      toast.error("Error fetching data");
    }
  };


  const statusHandler = async (event, orderId) => {
    console.log(event, orderId);
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value
    })

    if (response.data.success) {
      await fetchAllOrders();
      setIsverified(true)
    }
    if (publicKey == null) return;

    try {
      const order = orders.find(order => order._id === orderId);
      if (!order) {
        console.error("❌ Order not found in state!");
        return;
      }

      console.log("✅ Found order:", order);

      console.log(order.status)
      const contractResponse = await axios.post(
        `${url}/api/contract/completeQuest?userAddress=${publicKey}`
      );
      console.log("Transaction response:", contractResponse);
      toast.success('Transaction complete');
/*      const questId = order.items.find(item => item.category === "quests")?._id;

      if (questId) {
        const deleteResponse = await axios.delete(`${url}/api/order/deleteQuest`, {
          data: { orderId, questId }
        });
  
        if (deleteResponse.data.success) {
          console.log("✅ Quest deleted successfully from order");
        } else {
          console.error("❌ Failed to delete quest");
        }
      }*/

    } catch (error) {
      toast.error("Transaction error");
      console.error("Transaction error:", error);
    }
  };
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true); // Open the modal when an order is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedOrder(null); // Clear the selected order
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllOrders();  // Fetch orders first
      await fetchPublicKey();  // Then fetch public key
    };
    fetchData()
  }, [])

  return (
    <div className='order add'>
      <h3>Quest verification </h3>
      <div className="order-list">
        {orders.slice().map((order, index) => (
          <div key={index} className='order-item' >
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
              <p className='order-item-name'>{"public key: " + publicKey}</p>
              <div className='order-item-address'>

              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <button className='btnTrans' onClick={(e) => statusHandler(e, order._id)} value={"verified"} disabled={order.status === "verified"}>verified </button>
            Test Button <button className='btnTrans' onClick={(e) => statusHandler(e, order._id)} value={"notverified"} >verified </button>
            <button className='btnOrder' onClick={() => handleOrderClick(order)}>description</button>
          </div>
        ))}
      </div>
      <Modal show={isModalOpen} onClose={closeModal} order={selectedOrder} />
    </div>
  )
}

export default Order
