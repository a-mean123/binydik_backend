const express = require('express');
const router = express.Router();
const {
    createCommerce,
    existSlog,
    getPaginatedCommerces,
    getPageActiveCommerces,
    getPageArchivedCommerces,
    getPagePendingCommerces,
    getPageCommercesClient,
    getCommerceByCategorie,
    getRelatedCommerce,
    getCommerceById,
    getCommerceBySlog,
    deleteCommerce,
    updateCommerce,
    searchCommerces,
    restoreCommerce,
    archiveCommerce,
    featuredCommerce,
    getFeaturedCommerces,
    getCommercesTitles,
    getCommerceImageBySlog,
    updateCommerceStatus,
    getRecentCommerces
} = require('../controllers/commerce.controller');


const { verifyTokenAdmin } = require('../config/middlware/auth');

const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

let fileName = '';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/commerce');
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  });
  const upload = multer({ storage });


router.post('/create', verifyTokenAdmin , upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]) , (req, res) => {
    createCommerce(req, res);
});

router.put('/update/:id', verifyTokenAdmin , upload.single('image') , (req, res) => {
    updateCommerce(req, res, fileName);
});


router.get('/exist/:slog/:id', verifyTokenAdmin , existSlog);

router.get('/paginated', getPaginatedCommerces);

router.get('/pagependingcommerce/:page', verifyTokenAdmin ,getPagePendingCommerces);
router.get('/pageactivecommerce/:page', verifyTokenAdmin ,getPageActiveCommerces);
router.get('/pagearchivedcommerce/:page', verifyTokenAdmin ,getPageArchivedCommerces);
router.get('/pagecommerceclient' ,getPageCommercesClient);
router.get('/titles', verifyTokenAdmin ,getCommercesTitles);
router.get('/bycategorie/:cat', getCommerceByCategorie);
router.get('/relatedcommerces/:cat', getRelatedCommerce);
router.get('/byid/:id', verifyTokenAdmin , getCommerceById);

router.get('/byslog/:slog', getCommerceBySlog);
router.get('/commerceimagebyslog/:slog', getCommerceImageBySlog);
router.delete('/delete/:id', verifyTokenAdmin , deleteCommerce);


router.get('/search/:keyword/:categorie', searchCommerces);

router.get('/recent', getRecentCommerces);
router.get('/featuredlist', getFeaturedCommerces);
router.put('/featured/:id', verifyTokenAdmin , featuredCommerce);

router.put('/updatecommercestatus/:id', verifyTokenAdmin , updateCommerceStatus);


router.delete('/archive/:id', verifyTokenAdmin , archiveCommerce);
router.put('/restore/:id', verifyTokenAdmin , restoreCommerce);


module.exports = router;