const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes imports
const providerRoutes = require('./routes/providers');
const shelterRoutes = require('./routes/shelters');
const donationRoutes = require('./routes/donations');
const reservationRoutes = require('./routes/reservations');
const reportRoutes = require('./routes/reports');

// Mount routes
app.use('/api/providers', providerRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reports', reportRoutes);

// Database configuration & connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully to', process.env.MONGO_URI))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
    console.log(`PawRescue API is running on port ${PORT}`);
});
