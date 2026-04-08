const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// POST /create
router.post('/create', async (req, res) => {
    try {
        const donation = new Donation(req.body);
        await donation.save();
        res.status(201).json(donation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /all
router.get('/all', async (req, res) => {
    try {
        const query = {};
        
        // Search by foodName (regex)
        if (req.query.foodName) {
            query.foodName = { $regex: req.query.foodName, $options: 'i' };
        }
        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }
        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        const donations = await Donation.find(query).populate('providerId', 'name email');
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /:id
router.get('/:id', async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id).populate('providerId');
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        res.json(donation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /:id
router.put('/:id', async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        res.json(donation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        res.json({ message: 'Donation deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
