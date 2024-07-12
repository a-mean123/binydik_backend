const mongoose = require('mongoose');
const Wishlist = require('../models/wishlist.model');

// Get wishlist by user ID
const getWishlistByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId);

        let result = await Wishlist.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId) } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'commerces',
                    localField: 'items',
                    foreignField: '_id',
                    as: 'commerceDetails'
                }
            },
            { $unwind: '$commerceDetails' },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: 'commerceDetails.maincategorie',
                    foreignField: '_id',
                    as: 'commerceDetails.maincategorie'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'commerceDetails.subcategorie',
                    foreignField: '_id',
                    as: 'commerceDetails.subcategorie'
                }
            },
            {
                $lookup: {
                    from: 'facilities',
                    localField: 'commerceDetails.facilities',
                    foreignField: '_id',
                    as: 'commerceDetails.facilities'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'commerceDetails.owner',
                    foreignField: '_id',
                    as: 'commerceDetails.owner'
                }
            },
            { $unwind: '$commerceDetails.owner' },
            {
                $project: {
                    'commerceDetails._id': 1,
                    'commerceDetails.title': 1,
                    'commerceDetails.slog': 1,
                    'commerceDetails.createdAt': 1,
                    'commerceDetails.updatedAt': 1,
                    'commerceDetails.maincategorie': 1,
                    'commerceDetails.subcategorie': 1,
                    'commerceDetails.facilities': 1,
                    'commerceDetails.keywords': 1,
                    'commerceDetails.image': 1,
                    'commerceDetails.gallery': 1,
                    'commerceDetails.city': 1,
                    'commerceDetails.averageRating': 1,
                    'commerceDetails.openingHours': 1,
                    'commerceDetails.owner.fullname': 1,
                    'commerceDetails.owner.image': 1,
                    'commerceDetails.owner.ville': 1
                }
            },
            {
                $group: {
                    _id: '$userId',
                    items: { $push: '$commerceDetails' }
                }
            }
        ]);

        console.log('fffffffffffffffffffffff', result[0]);
        res.status(200).json(result[0] || { items: [] });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, commerceId } = req.body;
        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $addToSet: { items: commerceId } },
            { new: true, upsert: true }
        ).populate('items');
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, commerceId } = req.body;
        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { items: commerceId } },
            { new: true }
        ).populate('items');
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    removeFromWishlist,
    addToWishlist,
    getWishlistByUserId
}
