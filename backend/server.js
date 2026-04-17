const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// --- SAFE CONFIGURATION LAYER ---
// We define these here so the app works even if .env fails to load
const MONGO_URI = "mongodb+srv://bhawsarvinayak55_db_user:fKPV6xSmbgbafJD3@cluster0.innesfk.mongodb.net/hospital_db?retryWrites=true&w=majority";
const PORT = 5000;

// Import Routes
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Essential for parsing JSON bodies

// --- DATABASE CONNECTION ---
// Using the hardcoded URI as a fallback to ensure the recruiter can run it
mongoose.connect(MONGO_URI)
    .then(() => console.log(" SUCCESS: Database connection established!"))
    .catch(err => {
        console.error(" ERROR: Database connection failed!");
        console.error(err.message);
    });

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
    res.status(200).json({
        status: "Success",
        message: "Hospital Management System API is LIVE."
    });
});

// --- SERVER START ---
app.listen(PORT, () => {
    console.log(` Server is breathing on http://localhost:${PORT}`);
});