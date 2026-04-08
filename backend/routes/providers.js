const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');

// POST /create
router.post('/create', async (req, res) => {
    try {
        const provider = new Provider(req.body);
        await provider.save();
        res.status(201).json(provider);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /all
router.get('/all', async (req, res) => {
    try {
        const providers = await Provider.find();
        res.json(providers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /:id
router.get('/:id', async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id);
        if (!provider) return res.status(404).json({ error: 'Provider not found' });
        res.json(provider);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /:id
router.put('/:id', async (req, res) => {
    try {
        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!provider) return res.status(404).json({ error: 'Provider not found' });
        res.json(provider);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
    try {
        const provider = await Provider.findByIdAndDelete(req.params.id);
        if (!provider) return res.status(404).json({ error: 'Provider not found' });
        res.json({ message: 'Provider deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
