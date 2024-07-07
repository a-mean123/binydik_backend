const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const facilitieSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    maincategorie: {
        type: ObjectId,
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

module.exports = mongoose.model('Facilitie', facilitieSchema);