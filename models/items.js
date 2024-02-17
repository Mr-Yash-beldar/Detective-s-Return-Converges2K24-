const mongoose = require('mongoose');

// Define schema
const componentSchema = new mongoose.Schema({
  componentId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

// Define model
const Component = mongoose.model('Component', componentSchema);

module.exports = Component;
