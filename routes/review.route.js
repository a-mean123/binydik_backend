const express = require('express');

const router = express.Router();
const {
    createReview,
    getCommerceReviews,
    getCommerceAverageReview,
    getReviewById,
    deleteReview,
    updateReview,
    getMyCommerceReview
} = require('../controllers/review.controller');

const { verifyTokenUser, verifyTokenAdmin } = require('../config/middlware/auth');

router.post('/create', verifyTokenUser, createReview);
router.get('/myCommercereview/:idCommerce/:idUser', verifyTokenUser, getMyCommerceReview);
router.get('/Commercereviews/:idCommerce/:page', getCommerceReviews);
router.get('/Commerceaveragereviews/:idCommerce', getCommerceAverageReview);
router.get('/byid/:id', verifyTokenAdmin, getReviewById);
router.delete('/delete/:id', verifyTokenAdmin, deleteReview);
router.put('/update/:id', verifyTokenAdmin, updateReview);


module.exports = router;