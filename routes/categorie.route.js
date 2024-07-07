const express = require('express');

const router = express.Router();
const {
    createCategorie,
    getAllCategories,
    getCategorieById,
    deleteCategorie,
    updateCategorie,
    archiveListCategories,
    restoreCategorie,
    archiveCategorie
} = require('../controllers/categorie.controller');
const { verifyTokenAdmin } = require('../config/middlware/auth');

router.post('/create', verifyTokenAdmin , createCategorie);
router.get('/all', getAllCategories);
router.get('/byid/:id', verifyTokenAdmin , getCategorieById);
router.delete('/delete/:id', verifyTokenAdmin , deleteCategorie);
router.put('/update/:id', verifyTokenAdmin , updateCategorie);
router.delete('/archive/:id', verifyTokenAdmin , archiveCategorie);
router.put('/restore/:id', verifyTokenAdmin , restoreCategorie);
router.get('/archivelist', verifyTokenAdmin , archiveListCategories);



module.exports = router;