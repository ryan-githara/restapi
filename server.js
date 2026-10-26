// server.js
// Checkpoint: REST API with Mongoose

// 1. Load environment variables from config/.env
require('dotenv').config({ path: './config/.env' });

const express = require('express');
const mongoose = require('mongoose');

// 2. Import User model from models/User.js
const User = require('./models/User');

const app = express();

// 3. Middleware to parse JSON body (needed for POST and PUT from Postman)
app.use(express.json());

// 4. Connect to MongoDB and start server
async function startServer() {
  // Check if MONGO_URI exists in .env
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set in config/.env');
  }

  // Connect to database
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected Successfully!');

  // Start express server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer().catch(err => {
  console.error(err.message);
});

// 5. ROUTES

// ROUTE 1: GET - RETURN ALL USERS
// Example: GET http://localhost:3000/api/users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Mongoose method: find all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ROUTE 2: POST - ADD A NEW USER TO DATABASE
// Example: POST http://localhost:3000/api/users
// In Postman Body: { "name": "Ali", "age": 20, "email": "ali@test.com" }
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body); // Create new user from request body
    const savedUser = await newUser.save(); // Save to MongoDB
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ROUTE 3: PUT - EDIT A USER BY ID
// Example: PUT http://localhost:3000/api/users/6655a1b2c3d4e5f6a7b8c9d0
app.put('/api/users/:id', async (req, res) => {
  try {
    // findByIdAndUpdate: first param is ID from URL (req.params.id), second is new data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ROUTE 4: DELETE - REMOVE A USER BY ID
// Example: DELETE http://localhost:3000/api/users/6655a1b2c3d4e5f6a7b8c9d0
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id); // Delete user by ID
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});