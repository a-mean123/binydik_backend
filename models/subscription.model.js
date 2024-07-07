const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const subscriptionSchema = new mongoose.Schema({

    idUser: {
        type: ObjectId,
        require: true
    },
    idCourse: {
        type: ObjectId,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    archived: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Subscription', subscriptionSchema);