const mongoose = require("mongoose");

const detectiveSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  leaderName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
});

const Detective = mongoose.model("Detective", detectiveSchema);

module.exports = Detective;
