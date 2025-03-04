// server.js
const express = require("express"); // Only declare express once
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ethers } = require("ethers");
require("dotenv").config();
const userRoutes = require('./src/userRoutes');
const { getUsers, getUserById } = require('./src/userController');


const app = express();
const PORT = process.env.PORT || 4000;
/*
// Contract ABI and provider setup
const contractABI = require("./artifacts/contracts/HelloWorld.sol/HelloWorld.json"); 
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = "0xEAd57E231e485567ccC5eEe65a7c1791123D761F";
const contract = new ethers.Contract(contractAddress, contractABI.abi, wallet);
*/
// Middleware
app.use(cors());
app.use(bodyParser.json()); // Add body parser middleware
app.use(express.json()); // Add express json middleware

// MongoDB connection


const uri = 'mongodb+srv://admin:1234@cluster0.9y4p74j.mongodb.net/DatabaseBlockchain';


mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

  app.get('/user', getUsers);
// Routes
/*
app.get("/status", async(req, res) => {
    const message = await contract.message();
    res.status(200).send({
        status: true,
        message: 'hello world!',
        data: {
            message
        }
    })
});

app.post("/update", async (req, res) => {
    try {
      const { newMessage } = req.body;
      const tx = await contract.update(newMessage);
      await tx.wait();
      res.json({ txHash: tx.hash, newMessage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});*/
// Server listen
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
