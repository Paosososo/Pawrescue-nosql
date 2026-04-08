const mongoose = require('mongoose');

// Demonstrates NoSQL document structure where a subdocument (location) is embedded
const providerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }, // unique index removed for demo ease
    phone: { type: String },
    address: { type: String },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] } // [longitude, latitude]
    }
}, { timestamps: true });

// Optional: for real geospatial queries, you'd add: providerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Provider', providerSchema);
