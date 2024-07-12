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

    location: {
        type: Number,
        required: true
    },
    cleanliness: {
        type: Number,
        required: true
    },
    service: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        require: false
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: [ObjectId],
        default: []
    },
    dislikedBy: {
        type: [ObjectId],
        default: []
    }

})



module.exports = mongoose.model('Review', reviewSchema);