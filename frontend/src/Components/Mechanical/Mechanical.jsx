import React, { useContext, useState } from 'react';
import PartsItem from '../PartsItem/PartsItem';
import { StoreContext } from '../../Context/StoreContext';

import './Mechanical.css';

const Mechanical = ({ category }) => {
  const { parts_list } = useContext(StoreContext);
  
  // State to store the selected quest
  const [selectedQuest, setSelectedQuest] = useState(null);

  // Handle quest selection
  const handleSelectQuest = (quest) => {
    if (!selectedQuest) {
      setSelectedQuest(quest); // Select the quest if none is selected yet
    }
  };

  return (
    <div className='parts-display' id='parts-display'>
      <h2>Quests</h2>
      <div className='parts-display-list'>
        {parts_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <div key={item._id} className="quest-item">
                <PartsItem 
                  image={item.image} 
                  name={item.name} 
                  desc={item.description} 
                  price={item.price} 
                  amount={item.amount} 
                  id={item._id} 
                />
                
                {/* Display a button to select quest */}
                <button 
                  onClick={() => handleSelectQuest(item)} 
                  disabled={selectedQuest} // Disable button if a quest is already selected
                >
                  {selectedQuest ? 'Quest Selected' : 'Select Quest'}
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>

      {selectedQuest && (
        <div className="selected-quest">
          <h3>Selected Quest:</h3>
          <p>{selectedQuest.name}</p>
          <p>{selectedQuest.description}</p>
        </div>
      )}
    </div>
  );
};

export default Mechanical;
