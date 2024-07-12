const Review = require('../models/review.model');
const Commerce = require('../models/commerce.model');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

const updateCommerceRating = async (idCommerce) => {

    try {

        console.log('rerzer',idCommerce);
        const reviews = await Review.find({ idCommerce: idCommerce });
        const totalReviews = reviews.length;
        console.log(totalReviews);

        if (totalReviews === 0) {
            return; // No reviews yet, average rating remains unchanged
        }

        const totalLocation = reviews.reduce((sum, review) => sum + review.location, 0);
        const totalCleanliness = reviews.reduce((sum, review) => sum + review.cleanliness, 0);
        const totalService = reviews.reduce((sum, review) => sum + review.service, 0);

        const averageLocation = totalLocation / totalReviews;
        const averageCleanliness = totalCleanliness / totalReviews;
        const averageService = totalService / totalReviews;

        const averageRating = (averageCleanliness + averageLocation + averageService) / 3;
        console.log('qsdqsdqsdqsd',averageRating);
        await Commerce.findByIdAndUpdate({ _id: idCommerce }, { averageRating }); // Update product's average rating

    } catch (error) {
        console.error('Error updating product average rating:', error);
    }

}

const createReview = async (req, res) => {

    try {
        const user = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY_USER);
        const review = await Review.findOne({ idCommerce: req.body.idCommerce, idUser: user.id });
      
        if (review) {
            review.comment = req.body.comment;
            review.location = req.body.location;
            review.cleanliness = req.body.cleanliness;
            review.service = req.body.service;
            await review.save();
         
            await updateCommerceRating(req.body.idCommerce);
            res.status(201).json(review);
        } else {
            const review = new Review(req.body);
            review.idUser = user.id;
            await review.save();
            await updateCommerceRating(req.body.idCommerce);
            res.status(201).json(review);
        }


    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const getCommerceReviews = async (req, res) => {

    try {
        let { page, idCommerce } = req.params;
        let startIndex = (page - 1) * 10;
        let result = await Review.aggregate([
            { $match: { idCommerce: ObjectId(idCommerce) } },
            { $sort: { eid: -1, modifyDate: -1 } },
            { $skip: startIndex },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'idUser',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    '_id': 1,
                    'idCommerce': 1,
                    'date': 1,
                    'location': 1,
                    'cleanliness': 1,
                    'service': 1,
                    'comment': 1,
                    'likes':1,
                    'dislikes':1,
                    'user.fullname': 1,
                    'user.image': 1,
                    'user.ville':1
                }
            }

        ])
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getCommerceAverageReview = async (req, res) => {
    try {
        let { idCommerce } = req.params;
        let reviews = await Review.find({ idCommerce });
        let result = {
            one: 0,
            two: 0,
            three: 0,
            four: 0,
            five: 0,
            total: reviews.length,

            location: 0,
            cleanliness: 0,
            service: 0
        };
        for (let review of reviews) {
            switch (review.review) {
                case 1: result.one++; break;
                case 2: result.two++; break;
                case 3: result.three++; break;
                case 4: result.four++; break;
                case 5: result.five++; break;
            }

            result.location += review.location;
            result.cleanliness += review.cleanliness;
            result.service += review.service;
        }

        result.location /= result.total;
        result.cleanliness /= result.total;
        result.service /= result.total;

        res.status(201).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getMyCommerceReview = async (req, res) => {

    try {

        let { idCommerce, idUser } = req.params;
        let result = await Review.findOne({ idCommerce, idUser });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}
const getReviewById = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await Review.findById({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const deleteReview = async (req, res) => {

    try {

        let { id } = req.params;
        const review = await Review.findById({ _id: id });
        let result = await Review.findByIdAndDelete({ _id: id });
      
        await updateCommerceRating(review.idCommerce);

        res.status(200).send(result);

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

const updateReview = async (req, res) => {

    try {

        let { id } = req.params;
        let data = req.body;
        let result = await Review.findByIdAndUpdate({ _id: id }, data);
        await updateCommerceRating(result.idCommerce);
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const likeReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Assuming user ID is stored in req.user

        const review = await Review.findById(id);

        if (review.likedBy.includes(userId)) {
            return res.status(400).json({ message: 'User has already liked this review' });
        }

        review.likes += 1;
        review.likedBy.push(userId);

        // Remove user from dislikes if they previously disliked the review
        if (review.dislikedBy.includes(userId)) {
            review.dislikes -= 1;
            review.dislikedBy = review.dislikedBy.filter(id => id.toString() !== userId);
        }

        await review.save();
        res.status(200).json(review);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

const dislikeReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Assuming user ID is stored in req.user

        const review = await Review.findById(id);

        if (review.dislikedBy.includes(userId)) {
            return res.status(400).json({ message: 'User has already disliked this review' });
        }

        review.dislikes += 1;
        review.dislikedBy.push(userId);

        // Remove user from likes if they previously liked the review
        if (review.likedBy.includes(userId)) {
            review.likes -= 1;
            review.likedBy = review.likedBy.filter(id => id.toString() !== userId);
        }

        await review.save();
        res.status(200).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createReview,
    getCommerceReviews,
    getCommerceAverageReview,
    getReviewById,
    deleteReview,
    updateReview,
    getMyCommerceReview,
    likeReview,
    dislikeReview
}