const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Detective = require('./models/detective');
const Component = require('./models/items');
require('dotenv').config();

const dbURI = String(process.env.DATABASE);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(dbURI, {
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.send('Welcome to the Detective Store API');
});


// signup api
app.post('/signup', async (req, res) => {
  try {
    const { teamId, teamName, leaderName, email, points, password } = req.body;

    // Check if detective with the same email already exists
    const existingDetective = await Detective.findOne({ email });
    if (existingDetective) {
      return res.status(400).json({ message: 'Detective with this email already exists' });
    }

    // Create a new detective
    const newDetective = new Detective({
      teamId,
      teamName,
      leaderName,
      email,
      points,
      password
    });

    // Save the detective to the database
    await newDetective.save();

    res.status(201).json({ message: 'Detective signed up successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//login api
app.post('/login', async (req, res) => {
  try {
    const { teamId, password } = req.body;
    // Find detective by teamId
    const detective = await Detective.findOne({ teamId });
    if (!detective) {
      return res.status(404).json({ message: 'Detective team not found' });
    }
    // Check if password matches
    if (detective.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    // Store email in cookie
    res.cookie('email', detective.email, { maxAge: 900000, httpOnly: true }); // Set cookie expiration time (maxAge) as per your requirement
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/components', async (req, res) => {
  try {
    const components = await Component.find();
    res.status(200).json(components);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/detectives', async (req, res) => {
  try {
    const detectives = await Detective.find();
    res.status(200).json(detectives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/purchase/:componentId', async (req, res) => {
  try {
    const { componentId } = req.params;

    // Find the component by ID and retrieve its price
    const component = await Component.findOne({ componentId });
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    const componentPrice = component.price;

    // Get detective's email from cookie
    const detectiveEmail = req.cookies.email;

    // Find detective by email
    const detective = await Detective.findOne({ email: detectiveEmail });
    if (!detective) {
      return res.status(404).json({ message: 'Detective not found' });
    }

    // Deduct component price from detective's points
    detective.points -= componentPrice;
    await detective.save();

    res.status(200).json({ message: 'Purchase successful', remainingPoints: detective.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
