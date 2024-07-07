const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const signalSchema = new mongoose.Schema({

    idUser: {
        type: ObjectId,
        require: true
    },
    idCommerce: {
        type: ObjectId,
        require: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        default: 'pending'
    },
    reason: {
        type: String,
        require: true
    }

})



module.exports = mongoose.model('Signal', signalSchema);