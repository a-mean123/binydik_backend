const mongoose = require('mongoose');
const { featuredArticle } = require('../controllers/article.controller');

const categorieSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    icon: {
        type: String,
        require: true
    },
    archived: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        default: new Date()
    }
})

module.exports = mongoose.model('MainCategorie', categorieSchema);