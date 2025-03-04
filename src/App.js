import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserPage from './components/Userpage';
import AdminPage from './components/Admin';
import Home from './components/Home';
import UploadImage from './components/UploadImages';
import QuestsPage from './components/QuestPage';


const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/login" element={<UserPage/>} />
          <Route path="/loginAd" element={<AdminPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Quest" element={<QuestsPage />} />
          <Route path="/upload" element={<UploadImage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
