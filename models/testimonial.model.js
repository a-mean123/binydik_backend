const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    fonction: {
        type: String,
        require: false
    },
    description: {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: new Date()
    },
    featured: {
        type: Boolean,
        default: false
    },

})

module.exports = mongoose.model('Testimonial', testimonialSchema);