const mongoose = require('mongoose');

// Demonstrates referencing other documents via ObjectId (providerId)
const donationSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    foodName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    status: {
        type: String,
        enum: ['available', 'reserved', 'picked_up', 'expired', 'cancelled'],
        default: 'available'
    },
    pickupLocation: { type: String },
    pickupTime: { type: Date },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
