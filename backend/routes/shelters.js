const express = require('express');
const router = express.Router();
const Shelter = require('../models/Shelter');

// POST /create
router.post('/create', async (req, res) => {
    try {
        const shelter = new Shelter(req.body);
        await shelter.save();
        res.status(201).json(shelter);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /all
router.get('/all', async (req, res) => {
    try {
        const shelters = await Shelter.find();
        res.json(shelters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /:id
router.get('/:id', async (req, res) => {
    try {
        const shelter = await Shelter.findById(req.params.id);
        if (!shelter) return res.status(404).json({ error: 'Shelter not found' });
        res.json(shelter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /:id
router.put('/:id', async (req, res) => {
    try {
        const shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!shelter) return res.status(404).json({ error: 'Shelter not found' });
        res.json(shelter);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
    try {
        const shelter = await Shelter.findByIdAndDelete(req.params.id);
        if (!shelter) return res.status(404).json({ error: 'Shelter not found' });
        res.json({ message: 'Shelter deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
