const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const couponSchema = new mongoose.Schema({

    code: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    discount: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        default: new Date()
    },
    idCourse: {
        type: ObjectId,
        require: true
    },
    expirationDate: {
        type: String,
        require: true
    } 
    
})



module.exports = mongoose.model('Coupon', couponSchema);