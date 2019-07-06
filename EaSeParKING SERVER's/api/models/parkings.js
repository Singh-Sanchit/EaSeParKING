const mongoose = require('mongoose');

const parkingSchema = mongoose.Schema({
    patch_id: {
        type: Number
    },
    name: {
        type: String
    },
    landmark: {
        type: String
    },
    city: {
        type: String
    },
    pincode: {
        type: Number
    },
    state: {
        type: String
    },
    patch_type: {
        type: String,
        default: 'patch'
    },
    color: {
        type: String
    },
    patch_active: {
        type: Boolean,
        default: true
    },
    capacity: {
        type: Number,
        default: 1
    },
    capacity_count: {
        type: Number,
        default: 0
    },
    book_count: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdOn: {
        type: String,
        default: Date()
    },
    lastModifiedOn: {
        type: String,
        default: Date()
    },
    coordinates: {
        type: Array
    },
});

module.exports = mongoose.model('Parking',parkingSchema);