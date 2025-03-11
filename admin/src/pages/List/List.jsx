import React, { useEffect, useState } from 'react';
import { url } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

import './List.css';

const List = () => {

  const [list,setList] = useState([]);
  
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/parts/list`)
    if(response.data.success)
    {
      setList(response.data.data);
    }
    else{
      toast.error("Error")
    }
  }

  const removePart = async (partId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this part?");
      if (!confirmDelete) return;

      const response = await axios.post(`${url}/api/parts/remove`, { id: partId });
      await fetchList();

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error removing part:", error);
      toast.error("Failed to remove part");
    }
  };

  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className='list add flex-col'>
        <p>All Parts List</p>
        <div className='list-table'>
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Amount</b>
            <b>Action</b>
          </div>
          {list.map((item,index)=>{
            return (
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/`+item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <p>{item.amount}</p>
                
                <p className='cursor' onClick={()=>removePart(item._id)}>x</p>
              </div>
            )
          })}
        </div>
    </div>
  )
}

export default List
