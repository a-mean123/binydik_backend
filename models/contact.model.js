const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    reason: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    subject: {
        type: String,
        require: false
    },
    message: {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: new Date()
    }

})

module.exports = mongoose.model('Contact', contactSchema);