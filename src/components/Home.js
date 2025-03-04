import React from 'react';
import NavBar from './navbar.js';  // Import the NavBar component

const Home = () => {
  return (
    <div>
      <NavBar />  {/* Add the navbar here */}
      <div className="container mt-5">
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of the app!</p>
      </div>
    </div>
  );
};

export default Home;
