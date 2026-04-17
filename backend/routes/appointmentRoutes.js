const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// 1. BOOK AN APPOINTMENT
router.post('/book', async (req, res) => {
    try {
        const { patientId, doctorId, date } = req.body;

        if (!patientId || !doctorId || !date) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        const newAppointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date: date
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully", newAppointment });
    } catch (err) {
        res.status(500).json({ message: "Error booking appointment", error: err.message });
    }
});

// 2. GET APPOINTMENTS (For a specific user)
router.get('/:userId', async (req, res) => {
    try {
        // This finds appointments where the user is either the patient or the doctor
        const appointments = await Appointment.find({
            $or: [{ patient: req.params.userId }, { doctor: req.params.userId }]
        })
        .populate('patient', 'name')
        .populate('doctor', 'name specialization');

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments" });
    }
});

// 3. CANCEL APPOINTMENT
router.delete('/cancel/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: "Appointment cancelled successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error cancelling appointment" });
    }
});

module.exports = router;