const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/BINYDIK"


mongoose.connect(MONGODB_URI)
    .then(
        () => {
            console.log('connected');
        }
    )
    .catch(
        (err) => {
            console.log(err);
        }
    )