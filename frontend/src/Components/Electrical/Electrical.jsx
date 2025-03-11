import React, { useContext } from 'react';
import PartsItem from '../PartsItem/PartsItem';
import { StoreContext } from '../../Context/StoreContext';

import './Electrical.css';

const Electrical = ({category}) => {

  const {parts_list} = useContext(StoreContext);


  return (
    <div className='parts-display' id='parts-display'>
      <h2>Electrical Product</h2>
      <div className='parts-display-list'>
        {parts_list.map((item)=>{
          if (category==="All" || category===item.category) {
            return <PartsItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} amount={item.amount} id={item._id}/>
          }
        })}
      </div>
    </div>
  )
}

export default Electrical