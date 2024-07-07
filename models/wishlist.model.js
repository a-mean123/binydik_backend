// models/Wishlist.js
const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commerce' }]
});

module.exports = mongoose.model('Wishlist', WishlistSchema);