const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// POST /create
router.post('/create', async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(201).json(reservation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /all
router.get('/all', async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('donationId')
            .populate('shelterId')
            .populate('providerId');
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /:id
router.get('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('donationId')
            .populate('shelterId')
            .populate('providerId');
        if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /:id
router.put('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
        res.json(reservation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
