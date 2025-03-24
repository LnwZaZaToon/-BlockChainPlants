import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import PartsItem from '../PartsItem/PartsItem';
import { StoreContext } from '../../Context/StoreContext';
import LoginPopup from '../LoginPopup/LoginPopup'; // Import the popup
import './Mechanical.css';

const Quests = () => {
  const { parts_list, token } = useContext(StoreContext);
  const [category, setCategory] = useState("All");
  const storedQuest = JSON.parse(localStorage.getItem('selectedQuest')) || null;
  const [selectedQuest, setSelectedQuest] = useState(storedQuest);
  const [showLogin, setShowLogin] = useState(false); // State for login popup

  useEffect(() => {
    if (selectedQuest) {
      localStorage.setItem('selectedQuest', JSON.stringify(selectedQuest));
    }
  }, [selectedQuest]);

  const handleSelectQuest = (quest) => {
    if (!token) {
      setShowLogin(true); // Show login popup if not logged in
    } else if (!selectedQuest) {
      setSelectedQuest(quest);
    }
  };

  return (
    <div className='parts-display' id='parts-display'>
      <h2>Quests</h2>

      {!token && <p className="login-warning">⚠️ Please log in to select a quest.</p>}

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
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Render the LoginPopup if showLogin is true */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
    </div>
  );
};

export default Quests;
