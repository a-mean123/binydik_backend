const express = require('express');

const router = express.Router();
const {
    createMainCategorie,
    getAllMainCategories,
    getMainCategorieById,
    deleteMainCategorie,
    updateMainCategorie,
    archiveListMainCategories,
    restoreMainCategorie,
    archiveMainCategorie,
    getAllMainCategoriesWithSubCategorie,
    getFeaturedCategories,
    featuredCategorie
} = require('../controllers/maincategorie.controller');
const { verifyTokenAdmin } = require('../config/middlware/auth');

router.post('/create', verifyTokenAdmin , createMainCategorie);
router.get('/all', getAllMainCategories);
router.get('/mainwithsub', verifyTokenAdmin, getAllMainCategoriesWithSubCategorie);
router.get('/byid/:id', verifyTokenAdmin , getMainCategorieById);
router.delete('/delete/:id', verifyTokenAdmin , deleteMainCategorie);
router.put('/update/:id', verifyTokenAdmin , updateMainCategorie);
router.delete('/archive/:id', verifyTokenAdmin , archiveMainCategorie);
router.put('/restore/:id', verifyTokenAdmin , restoreMainCategorie);
router.get('/archivelist', verifyTokenAdmin , archiveListMainCategories);
router.get('/featuredlist', getFeaturedCategories);
router.put('/featured/:id', verifyTokenAdmin , featuredCategorie);



module.exports = router;