const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }, 
    email: {
        type: String, 
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String, 
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        unique: true,
        required: true
    },
    licenseNo: {
        type: String,
        required: true
    },
    licenseValidDate: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    ward_no: {
        type: String,
        required: true,
        default: '-'
    },
    createdOn: {
        type: String,
        default: Date()
    },
    lastModifiedOn: {
        type: String,
        default: Date()
    },
    user_type: {
        type: String,
        default: 'customer'
    },
    active_status: {
        type: Boolean,
        default: true
    },
    vehicle: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('User',userSchema);