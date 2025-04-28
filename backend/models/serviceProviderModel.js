const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    services: {
        type: String,
        enum: ['Packing', 'Loading', 'Unloading', 'Transportation', 'Full-Service Moving'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false 
    },
    availability: {
        type: Boolean,
        default: true
    },
    ratings: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    earnings: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default:'enabled'
    }
}, { timestamps: true });

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
module.exports = ServiceProvider;
