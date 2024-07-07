const mongoose = require('mongoose');


const adsSchema = new mongoose.Schema({

    url1: {
        type: String,
        default:''
    },
    banner1: {
        type: String,
        default:''
    },
    url2: {
        type: String,
        default:''
    },
    banner2: {
        type: String,
        default:''
    },
    url3: {
        type: String,
        default:''
    },
    banner3: {
        type: String,
        default:''
    },
    url4: {
        type: String,
        default:''
    },
    banner4: {
        type: String,
        default:''
    },
    url5: {
        type: String,
        default:''
    },
    banner5: {
        type: String,
        default:''
    }

})



module.exports = mongoose.model('Ads', adsSchema);