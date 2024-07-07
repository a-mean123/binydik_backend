const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const reviewSchema = new mongoose.Schema({

    idUser: {
        type: ObjectId,
        require: true
    },
    idCommerce: {
        type: ObjectId,
        require: true
    },
    parentReview: {
        type: ObjectId
    },
    date: {
        type: Date,
        default: new Date()
    },
    review: {
        type: Number,
        require: true
    },
    comment: {
        type: String,
        require: false
    }

})



module.exports = mongoose.model('Review', reviewSchema);