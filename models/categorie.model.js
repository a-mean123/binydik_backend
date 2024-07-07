const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    archived: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        default: new Date()
    }
})

module.exports = mongoose.model('Categorie', categorieSchema);