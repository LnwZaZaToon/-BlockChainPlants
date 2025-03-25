import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';

import Verify from './Pages/Verify/Verify';
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar';
import MyOrders from './Pages/MyOrders/MyOrders';
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import Quests from './Components/Quests/Quests';
import History from './Pages/History/History';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const [showLogin,setShowLogin] = useState(false);
  
  return (
    <>
    <ToastContainer/>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/order' element={<PlaceOrder />}/>
          <Route path='/history' element={<History />}/>
          <Route path='/myorders' element={<MyOrders />}/>
          <Route path='/quests' element={<Quests category= 'Mechanical'/>}/>
          <Route path='/verify' element={<Verify />}/>
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
