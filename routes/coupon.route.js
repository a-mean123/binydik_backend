const express = require('express');
const { generateCoupon, editCoupon, listCoupon, byIdCoupon, applyCoupon } = require('../controllers/coupon.controller');
const { verifyTokenAdmin, verifyTokenUser } = require('../config/middlware/auth');
const router = express.Router();


router.post('/create', verifyTokenAdmin, generateCoupon);
router.put('/edit/:id', verifyTokenAdmin, editCoupon );
router.get('/list', verifyTokenAdmin, listCoupon);
router.get('/byid/:id', verifyTokenAdmin, byIdCoupon);
router.post('/apply', verifyTokenUser, applyCoupon);

module.exports = router;