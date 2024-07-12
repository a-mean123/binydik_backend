const express = require('express');

const router = express.Router();
const {
    createReview,
    getCommerceReviews,
    getCommerceAverageReview,
    getReviewById,
    deleteReview,
    updateReview,
    getMyCommerceReview,
    likeReview,
    dislikeReview
} = require('../controllers/review.controller');

const { verifyTokenUser, verifyTokenAdmin } = require('../config/middlware/auth');

router.post('/create', verifyTokenUser, createReview);
router.get('/mycommercereview/:idCommerce/:idUser', verifyTokenUser, getMyCommerceReview);
router.get('/commercereviews/:idCommerce/:page', getCommerceReviews);
router.get('/commerceaveragereviews/:idCommerce', getCommerceAverageReview);
router.get('/byid/:id', verifyTokenAdmin, getReviewById);
router.delete('/delete/:id', verifyTokenAdmin, deleteReview);
router.put('/update/:id', verifyTokenAdmin, updateReview);
router.post('/like/:id', verifyTokenUser, likeReview);
router.post('/dislike/:id', verifyTokenUser, dislikeReview);

module.exports = router;