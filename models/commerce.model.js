const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const openingHoursSchema = new mongoose.Schema({
    day: { type: String },
    open: { type: String },
    close: { type: String }
});



const commerceSchema = new mongoose.Schema({

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
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    owner: {
        type: ObjectId,
        require: true
    },
    maincategorie: {
        type: ObjectId,
        require: true
    },
    subcategorie: {
        type: ObjectId,
        require: true
    },
    facilities: {
        type: [ObjectId]
    },
    keywords: {
        type: Array,
        default: []
    },
    image: {
        type: String,
        require: true
    },
    gallery: {
        type: Array,
        default: []
    },
    video: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    zip: {
        type: String,
        require: true
    },
    email: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    facebook: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'pending'
    },
    featured: {
        type: Boolean,
        default: false
    },
    archived: {
        type: Boolean,
        default: false
    },
    public: {
        type: Boolean,
        default: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    openingHours:  [openingHoursSchema]
    

})

commerceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Commerce', commerceSchema);


