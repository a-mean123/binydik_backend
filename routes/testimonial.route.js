const express = require('express');
const router = express.Router();


const {
    createTestimonial,
    getPageTestimonials,
    getTestimonialById,
    deleteTestimonial,
    updateTestimonial,
    getAllTestimonials,
    featuredTestimonial,
    getFeaturedTestimonials

} = require('../controllers/testimonial.controller');

const { verifyTokenAdmin } = require('../config/middlware/auth');




const multer = require('multer');

let fileName = '';
const diskStorage = multer.diskStorage({
    destination: './public/testimonial',
    filename: (req, file, cb) => {
        fileName = Date.now() + '.' + file.mimetype.split('/')[1];
        cb(null, fileName);
    }
})

const upload = multer({ storage: diskStorage });

router.post('/create', verifyTokenAdmin , upload.single('image'), (req, res) => {
    createTestimonial(req, res, fileName);
});

router.put('/update/:id', verifyTokenAdmin , upload.single('image'), (req, res) => {
    updateTestimonial(req, res, fileName);
});

router.get('/pagetestimonial/:page' , getPageTestimonials);
router.get('/all', getAllTestimonials);
router.get('/byid/:id', verifyTokenAdmin , getTestimonialById);

router.delete('/delete/:id', verifyTokenAdmin , deleteTestimonial);

router.get('/featuredlist', getFeaturedTestimonials);
router.put('/featured/:id', verifyTokenAdmin , featuredTestimonial);


module.exports = router;