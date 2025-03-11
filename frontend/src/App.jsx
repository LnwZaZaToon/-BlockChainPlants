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
import Mechanical from './Components/Mechanical/Mechanical';
import Electrical from './Components/Electrical/Electrical';

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
          <Route path='/myorders' element={<MyOrders />}/>
          <Route path='/mechanical' element={<Mechanical category= 'Mechanical'/>}/>
          <Route path='/electrical' element={<Electrical category= 'Electrical'/>}/>
          <Route path='/verify' element={<Verify />}/>
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
