// routes/userRoutes.js
const express = require('express');
const { getUsers, getUserById } = require('./userController');
const router = express.Router();

// Route to get all users
router.get('/users', getUsers);

// Route to get a user by ID
router.get('/users/:id', getUserById);

module.exports = router;
