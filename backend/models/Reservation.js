const mongoose = require('mongoose');

// Connects Donors, Shelters, and Donations using References
const reservationSchema = new mongoose.Schema({
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    shelterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    reservationStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    pickupDate: { type: Date },
    pickupTime: { type: String },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
