import React, { useEffect, useState } from 'react';
import { assets, url } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

import './Orders.css';

const Order = () => {

  const [orders, setOrders] = useState([]);
  const [publicKey , setPublicKey]= useState(null);
  const [Isverified , setIsverified] = useState(false);

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
  

  const statusHandler = async (event,orderId) => {
    console.log(event,orderId);
    const response = await axios.post(`${url}/api/order/status`,{
      orderId,
      status:event.target.value
    })

    if(response.data.success)
    {
      await fetchAllOrders();
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
    if (order.status === 'verified') {
      const contractResponse = await axios.post(
        `${url}/api/contract/completeQuest?userAddress=${publicKey}`
      );
      console.log("Transaction response:", contractResponse);
      toast.success('Transaction complete');
    }
  } catch (error) {
    toast.error("Transaction error");
    console.error("Transaction error:", error);
  }
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
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-parts'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  }
                  else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
                </p>
              <p className='order-item-name'>{"userId: "+order.userId}</p>
              <p className='order-item-name'>{"public key: "+publicKey}</p>
              <div className='order-item-address'>

              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(e)=>statusHandler(e,order._id)} value={order.status} name="" id=""   >
              <option value="verified">not verified</option>
              <option value="Product Processing">verified </option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order
