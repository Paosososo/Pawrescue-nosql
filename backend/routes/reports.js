const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const Shelter = require('../models/Shelter');
const Donation = require('../models/Donation');
const Reservation = require('../models/Reservation');

router.get('/summary', async (req, res) => {
    try {
        // Run aggregation pipelines and counts
        const [
            totalProviders,
            totalShelters,
            totalDonations,
            totalReservations,
            donationByStatus,
            donationByCategory,
            totalQuantityRes
        ] = await Promise.all([
            Provider.countDocuments(),
            Shelter.countDocuments(),
            Donation.countDocuments(),
            Reservation.countDocuments(),
            
            // Aggregation: Count donations by status
            Donation.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            
            // Aggregation: Count donations by category
            Donation.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ]),
            
            // Aggregation: Sum of all quantities
            Donation.aggregate([
                { $group: { _id: null, totalFood: { $sum: "$quantity" } } }
            ])
        ]);

        res.json({
            totalProviders,
            totalShelters,
            totalDonations,
            totalReservations,
            donationByStatus,
            donationByCategory,
            totalQuantity: totalQuantityRes.length > 0 ? totalQuantityRes[0].totalFood : 0
        });
    } catch (err) {
        console.error("Report Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
