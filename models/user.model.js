const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    tel: {
        type: String,
        require: true
    },
    ville: {
        type: String,
        require: true
    },
    image: {
        type: String,
        default: 'http://127.0.0.1:3626/user/avatar.png'
    },
    archived: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: new Date()
    },
    expireDate: {
        type: Date,
        default: new Date()
    },
    currentPoint: {
        type: Array,
        default: []
    },
    totalPoint: {
        type: Array,
        default: []
    },
    sold: {
        type: Number,
        default: 0
    },
    resetToken: {
        type: String,
        require: false
    },
    resetTokenExpiration: {
        type: Date
    },
    role: {
        type: String,
        default: 'user'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
})

module.exports = mongoose.model('User', userSchema);