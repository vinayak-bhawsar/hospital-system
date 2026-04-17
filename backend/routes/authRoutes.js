const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Using the same secret we used in server.js for consistency
const JWT_SECRET = "my_super_secret_key_123";

// 1. REGISTER USER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, specialization } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'patient', // Default to patient if not provided
            specialization: role === 'doctor' ? specialization : undefined 
        });

        await user.save();
        console.log(` New user registered: ${email}`);
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error(" Registration Error:", err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// 2. LOGIN USER
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log(` Login failed: User not found (${email})`);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Compare encrypted password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(` Login failed: Wrong password for (${email})`);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Create JWT Token (Using the hardcoded secret to avoid 'undefined' error)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        console.log(` User logged in: ${user.name} (${user.role})`);
        
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                role: user.role 
            } 
        });

    } catch (err) {
        console.error("Login Route Crash:", err.message);
        res.status(500).json({ message: "Login Error", error: err.message });
    }
});

// 3. GET ALL DOCTORS (For the patient booking list)
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: "Error fetching doctors" });
    }
});

module.exports = router;