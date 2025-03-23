require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

/*
module.exports = {
   solidity: "0.8.28",
   defaultNetwork: "sepolia",
   networks: {
      hardhat: {},
      sepolia: {
        url: "https://eth-sepolia.g.alchemy.com/v2/aRGSfkkruE2-lezhE9ejEysNC_6yu98n",  // directly paste URL here
        accounts: [`ef9a1c1a32195e98502de9e862ecd5b9083d9082875c8cecaab6354e8b334ff3`]  // directly paste private key here
      }
      
   },
};*/
module.exports = {
   solidity: "0.8.0",
   networks: {
     ganache: {
       url: "http://127.0.0.1:7545", // Default Ganache URL
       accounts: ["ef9a1c1a32195e98502de9e862ecd5b9083d9082875c8cecaab6354e8b334ff3"],    // You can use the private key of any Ganache account
     },
   },
 };
 
