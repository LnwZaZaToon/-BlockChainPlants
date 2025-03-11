import React, { useState } from 'react';
import Header from '../../Components/Header/Header';
import PartsDisplay from '../../Components/PartsDisplay/PartsDisplay';

const Home = () => {

  const [category,setCategory] = useState("All")

  return (
    <>
      <Header/>
      <PartsDisplay category={category}/>
    </>
  )
}

export default Home
