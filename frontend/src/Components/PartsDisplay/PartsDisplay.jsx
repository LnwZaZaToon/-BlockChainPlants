import React, { useContext } from 'react';
import PartsItem from '../PartsItem/PartsItem';
import { StoreContext } from '../../Context/StoreContext';

import './PartsDisplay.css';

const PartsDisplay = ({category}) => {

  const {parts_list} = useContext(StoreContext);

  const lastFourItems = parts_list.slice(-5);

  return (
    <div className='parts-display' id='parts-display'>
      <h2>Last Product Add</h2>
      <div className='parts-display-list'>
        {lastFourItems.map((item)=>{
          if (category==="All" || category===item.category) {
            return <PartsItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} amount={item.amount} id={item._id}/>
          }
        })}
      </div>
    </div>
  )
}

export default PartsDisplay
