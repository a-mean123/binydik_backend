// routes/wishlist.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');

router.get('/:userId', wishlistController.getWishlistByUserId);
router.post('/add', wishlistController.addToWishlist);
router.post('/remove', wishlistController.removeFromWishlist);

module.exports = router;