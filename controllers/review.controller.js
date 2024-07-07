const Review = require('../models/review.model');
const Commerce = require('../models/commerce.model');

const ObjectId = require('mongodb').ObjectId;

const updateCommerceRating = async (idCommerce) => {

    try {

        const reviews = await Review.find({ idCommerce });
        const totalReviews = reviews.length;

        if (totalReviews === 0) {
            return; // No reviews yet, average rating remains unchanged
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.review, 0);
        const averageRating = totalRating / totalReviews;

        await Commerce.findByIdAndUpdate({ _id: idCommerce }, { averageRating }); // Update product's average rating

    } catch (error) {
        console.error('Error updating product average rating:', error);
    }

}

const createReview = async (req, res) => {

    try {
        const review = await Review.findOne({ idCommerce: req.body.idCommerce, idUser: req.body.idUser });
        if (review) {
            review.comment = req.body.comment;
            review.review = req.body.review;
            await review.save();
            await updateCommerceRating(review.idCommerce);
            res.status(201).json(review);
        } else {
            const review = new Review(req.body);
            await review.save();
            await updateCommerceRating(review.idCommerce);
            res.status(201).json(review);
        }


    } catch (error) {
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
                    'idUser': 1,
                    'idCommerce': 1,
                    'date': 1,
                    'review': 1,
                    'comment': 1,
                    'user.fullname': 1,
                    'user.image': 1
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
            average: 0
        }
        for (let review of reviews) {
            switch (review.review) {
                case 1: result.one++;
                    break;
                case 2: result.two++;
                    break;
                case 3: result.three++;
                    break;
                case 4: result.four++;
                    break;
                case 5: result.five++;
                    break;
            }
            result.average += review.review;
        }

        result.average = result.average / result.total

        res.status(201).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


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


module.exports = {
    createReview,
    getCommerceReviews,
    getCommerceAverageReview,
    getReviewById,
    deleteReview,
    updateReview,
    getMyCommerceReview
}