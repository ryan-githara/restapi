// models/User.js
// This file defines the User schema using Mongoose

const mongoose = require('mongoose');

// 1. Define Schema - structure of a User document
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// 2. Export the model to use it in server.js
module.exports = mongoose.model('User', UserSchema);