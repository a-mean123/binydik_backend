const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const articleSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true
    },
    slog: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true,
    },
   
    date: {
        type: String,
        default: new Date()
    },
    categorie: {
        type: ObjectId,
        require: true
    },
  
    tags: {
        type: Array,
        require: true
    },
    image: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    archived: {
        type: Boolean,
        default: false
    }

})



module.exports = mongoose.model('Article', articleSchema);