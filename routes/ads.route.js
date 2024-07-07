const express = require('express');
const { editAds, listAds, editBanner1,
    editBanner2,
    editBanner3,
    editBanner4,
    editBanner5 } = require('../controllers/ads.controller');
const { verifyTokenAdmin } = require('../config/middlware/auth');
const router = express.Router();


const multer = require('multer');

let fileName = '';
const diskStorage = multer.diskStorage({
    destination: './public/ads',
    filename: (req, file, cb) => {
        fileName = Date.now() + '.' + file.mimetype.split('/')[1];
        cb(null, fileName);
    }
})

const upload = multer({ storage: diskStorage });

router.put('/edit/:id', verifyTokenAdmin, editAds);
router.get('/list', verifyTokenAdmin, listAds);

router.put('/editbanner1/:id', verifyTokenAdmin , upload.single('image'), (req, res) => {
    editBanner1(req, res, fileName);
    fileName = ''
});
router.put('/editbanner2/:id', verifyTokenAdmin , upload.single('image'), (req, res) => {
    editBanner2(req, res, fileName);
    fileName = ''
});
router.put('/editbanner3/:id', verifyTokenAdmin , upload.single('image'), (req, res) => {
    editBanner3(req, res, fileName);
    fileName = ''
});
router.put('/editbanner4/:id', verifyTokenAdmin , upload.single('image'), (req, res) => {
    editBanner4(req, res, fileName);
    fileName = ''
});
router.put('/editbanner5/:id', verifyTokenAdmin , upload.single('image'), (req, res) => {
    editBanner5(req, res, fileName);
    fileName = ''
});

module.exports = router;