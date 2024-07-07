const express = require('express');

const router = express.Router();
const {
    createSubCategorie,
    getAllSubCategories,
    getSubCategorieById,
    deleteSubCategorie,
    updateSubCategorie,
    getSubCategoriesByMainCategorie,
    archiveListSubCategories,
    archiveSubCategorie,
    restoreSubCategorie
} = require('../controllers/subcategorie.controller');

const { verifyTokenAdmin } = require('../config/middlware/auth');

router.post('/create', verifyTokenAdmin , createSubCategorie);
router.get('/all', getAllSubCategories);
router.get('/byid/:id', verifyTokenAdmin , getSubCategorieById);
router.get('/bymaincategorie/:main', getSubCategoriesByMainCategorie);
router.delete('/delete/:id', verifyTokenAdmin , deleteSubCategorie);
router.put('/update/:id', verifyTokenAdmin , updateSubCategorie);
router.delete('/archive/:id', verifyTokenAdmin , archiveSubCategorie);
router.put('/restore/:id', verifyTokenAdmin , restoreSubCategorie);
router.get('/archivelist', verifyTokenAdmin , archiveListSubCategories);


module.exports = router;