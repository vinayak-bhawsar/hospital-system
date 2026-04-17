const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const MONGO_URI = "mongodb+srv://bhawsarvinayak55_db_user:fKPV6xSmbgbafJD3@cluster0.innesfk.mongodb.net/hospital_db?retryWrites=true&w=majority";
const PORT = 5000;


const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();


app.use(cors());
app.use(express.json()); // Essential for parsing JSON bodies


mongoose.connect(MONGO_URI)
    .then(() => console.log(" SUCCESS: Database connection established!"))
    .catch(err => {
        console.error(" ERROR: Database connection failed!");
        console.error(err.message);
    });


app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);


app.get('/', (req, res) => {
    res.status(200).json({
        status: "Success",
        message: "Hospital Management System API is LIVE."
    });
});


app.listen(PORT, () => {
    console.log(` Server is breathing on http://localhost:${PORT}`);
});